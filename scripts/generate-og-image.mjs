/**
 * Generates the default Open Graph card at public/images/brand/og-default.png.
 *
 * The card is composed as flat vector artwork and rasterised once with sharp,
 * then committed. Nothing is rendered at request time, so a social crawler
 * never waits on a font download and the image cannot vary between deploys.
 *
 * Run with: node scripts/generate-og-image.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;
const OUTPUT = path.join(process.cwd(), "public", "images", "brand", "og-default.png");

const ink = "#1d2c22";
const paper = "#ece3d2";
const forest = "#2d6842";
const copper = "#9d6746";

/** Line-art fibre strands. Drawn, not an icon, and not a radial glow. */
function fibreStrands() {
  const strands = [];
  for (let index = 0; index < 11; index += 1) {
    const offset = index * 22;
    const sway = index % 2 === 0 ? 46 : -38;
    strands.push(
      `<path d="M ${872 + offset} 112 C ${872 + offset + sway} 232, ${872 + offset - sway} 376, ${872 + offset + sway * 0.4} 504"
         fill="none" stroke="${forest}" stroke-opacity="${0.5 - index * 0.03}" stroke-width="${2.4 - index * 0.12}" stroke-linecap="round" />`
    );
  }
  return strands.join("\n");
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${paper}" />

  <!-- Laid-paper texture: evenly spaced chain lines, the way real paper shows them. -->
  <g stroke="${ink}" stroke-opacity="0.045" stroke-width="1">
    ${Array.from({ length: 34 }, (_, index) => `<line x1="0" y1="${index * 19 + 9}" x2="${WIDTH}" y2="${index * 19 + 9}" />`).join("")}
  </g>

  <!-- A single printed border, inset like a title page. -->
  <rect x="46" y="46" width="${WIDTH - 92}" height="${HEIGHT - 92}" fill="none" stroke="${ink}" stroke-opacity="0.34" stroke-width="2" />
  <rect x="58" y="58" width="${WIDTH - 116}" height="${HEIGHT - 116}" fill="none" stroke="${copper}" stroke-opacity="0.3" stroke-width="1" />

  ${fibreStrands()}

  <!-- Masthead -->
  <text x="96" y="140" font-family="Courier New, monospace" font-size="21" letter-spacing="5.5" fill="${copper}">PAPER FOUNDATION INDIA</text>
  <line x1="96" y1="166" x2="700" y2="166" stroke="${ink}" stroke-opacity="0.35" stroke-width="1.5" />

  <text x="96" y="286" font-family="Georgia, Times New Roman, serif" font-size="92" font-weight="600" fill="${ink}">Paper, read</text>
  <text x="96" y="378" font-family="Georgia, Times New Roman, serif" font-size="92" font-weight="600" font-style="italic" fill="${forest}">as evidence.</text>

  <text x="96" y="446" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#5d675c">Myths tested against sources. Fibre followed through</text>
  <text x="96" y="482" font-family="Helvetica, Arial, sans-serif" font-size="27" fill="#5d675c">mills, recovery and everyday use.</text>

  <!-- Footer rule and origin -->
  <line x1="96" y1="534" x2="${WIDTH - 96}" y2="534" stroke="${ink}" stroke-opacity="0.3" stroke-width="1" />
  <text x="96" y="568" font-family="Courier New, monospace" font-size="19" letter-spacing="2.6" fill="${ink}" fill-opacity="0.72">PAPERFOUNDATION.IN</text>
  <text x="${WIDTH - 96}" y="568" text-anchor="end" font-family="Courier New, monospace" font-size="19" letter-spacing="2.6" fill="${copper}">KNOWLEDGE / MYTHS / GAMES</text>
</svg>`;

await mkdir(path.dirname(OUTPUT), { recursive: true });
const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
await writeFile(OUTPUT, png);
console.log(`Wrote ${OUTPUT} (${(png.length / 1024).toFixed(1)} KB, ${WIDTH}x${HEIGHT})`);
