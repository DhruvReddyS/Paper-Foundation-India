/**
 * Publishes the written article bodies and the myth citations into the CMS.
 *
 * Idempotent: running it twice produces the same result. It only overwrites a
 * body that is empty or that matches what this script previously wrote, so an
 * edit made by a human in the admin is never silently replaced. Pass --force
 * to overwrite regardless, which should be a deliberate act.
 *
 * Run with: npm run publish:content
 */
import { loadEnvConfig } from "@next/env";
import mongoose from "mongoose";
import { articleBodies } from "../content/articleBodies";
import { mythSources } from "../content/mythSources";
import mythCatalog from "../content/mythCatalog.json";
import { connectDB } from "../lib/db";
import { Article } from "../lib/models/Article";
import { Myth } from "../lib/models/Myth";

loadEnvConfig(process.cwd());

const force = process.argv.includes("--force");

async function run() {
  await connectDB();

  let bodiesWritten = 0;
  let bodiesSkipped = 0;
  let articlesMissing = 0;

  for (const [slug, entry] of Object.entries(articleBodies)) {
    const existing = await Article.findOne({ slug }).lean<{ body?: string } | null>();
    if (!existing) {
      articlesMissing += 1;
      console.warn(`  no article record for ${slug}; run the seed first`);
      continue;
    }

    const current = (existing.body ?? "").trim();
    // Leave anything an editor has written in place.
    const isEditorWritten = current.length > 0 && current !== entry.body.trim();
    if (isEditorWritten && !force) {
      bodiesSkipped += 1;
      continue;
    }

    const update: Record<string, unknown> = {
      body: entry.body,
      sources: entry.sources,
      readingMinutes: entry.readingMinutes,
      status: "published",
      revisionNote: "Body published from the editorial content set",
      lastEditedBy: "content-publisher",
    };
    if (!current) update.publishedAt = new Date();
    await Article.updateOne({ slug }, { $set: update });
    bodiesWritten += 1;
  }

  let citationsWritten = 0;
  let citationsSkipped = 0;

  for (const myth of mythCatalog as { id: string; myth: string }[]) {
    const sources = mythSources[myth.id];
    if (!sources?.length) continue;

    const record = await Myth.findOne({ claim: myth.myth }).lean<{ sources?: unknown[] } | null>();
    if (!record) continue;

    if (record.sources?.length && !force) {
      citationsSkipped += 1;
      continue;
    }

    await Myth.updateOne({ claim: myth.myth }, { $set: { sources, lastEditedBy: "content-publisher" } });
    citationsWritten += 1;
  }

  const [withBody, withSources, totalArticles, totalMyths] = await Promise.all([
    Article.countDocuments({ $expr: { $gte: [{ $strLenCP: { $ifNull: ["$body", ""] } }, 400] } }),
    Myth.countDocuments({ "sources.0": { $exists: true } }),
    Article.countDocuments({}),
    Myth.countDocuments({}),
  ]);

  console.log(
    JSON.stringify(
      {
        articles: { bodiesWritten, bodiesSkipped, missingRecords: articlesMissing, withPublishableBody: withBody, total: totalArticles },
        myths: { citationsWritten, citationsSkipped, withSources, total: totalMyths },
      },
      null,
      2
    )
  );
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
