/**
 * Recompresses the images in public/ that are larger than they need to be.
 *
 * Next.js optimises images it serves through next/image, but the originals
 * still ship in the deploy bundle and still have to be read and re-encoded on
 * the first request for each size. Shrinking the sources once makes the bundle
 * smaller and the first paint faster, and the quality settings here are chosen
 * to be visually indistinguishable at the sizes the site actually renders.
 *
 * Run with: node scripts/optimise-images.mjs [--dry]
 */
import { readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public");
const DRY = process.argv.includes("--dry");

// Nothing on the site renders wider than a full-bleed hero, so anything beyond
// this is detail no screen will ever show.
const MAX_WIDTH = 2200;
const MIN_BYTES = 180 * 1024;
const JPEG_QUALITY = 82;

async function walk(dir) {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (/\.(jpe?g|png)$/i.test(entry.name)) found.push(full);
  }
  return found;
}

const files = await walk(ROOT);
let savedBytes = 0;
let changed = 0;

for (const file of files) {
  const before = (await stat(file)).size;
  if (before < MIN_BYTES) continue;

  const image = sharp(file, { failOn: "none" });
  const meta = await image.metadata();
  const isPng = /\.png$/i.test(file);
  const pipeline = meta.width && meta.width > MAX_WIDTH ? image.resize({ width: MAX_WIDTH }) : image;

  const output = isPng
    ? await pipeline.png({ compressionLevel: 9, palette: true }).toBuffer()
    : await pipeline.jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true }).toBuffer();

  // Only rewrite when the new encoding is meaningfully smaller.
  if (output.length >= before * 0.92) continue;

  savedBytes += before - output.length;
  changed += 1;
  const relative = path.relative(ROOT, file);
  console.log(
    `${DRY ? "would save" : "saved"} ${String(Math.round((before - output.length) / 1024)).padStart(5)} KB  ` +
      `${String(Math.round(before / 1024)).padStart(5)} -> ${String(Math.round(output.length / 1024)).padStart(5)} KB  ${relative}`
  );
  if (!DRY) await writeFile(file, output);
}

console.log(`\n${changed} file(s) ${DRY ? "would be" : ""} recompressed, ${(savedBytes / 1048576).toFixed(1)} MB saved.`);
