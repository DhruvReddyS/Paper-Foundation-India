import bcrypt from "bcryptjs";
import { loadEnvConfig } from "@next/env";
import { articleCatalog, articleCoverImage } from "../content/articleCatalog";
import { resourceCatalog } from "../content/resources";
import { glossaryData } from "../content/glossary";
import mythCatalog from "../content/mythCatalog.json";
import { gameCatalog } from "../components/games/gameCatalog";
import { connectDB } from "../lib/db";
import { AdminUser } from "../lib/models/AdminUser";
import { Article } from "../lib/models/Article";
import { GameConfig } from "../lib/models/GameConfig";
import { Glossary } from "../lib/models/Glossary";
import { Myth } from "../lib/models/Myth";
import { Resource } from "../lib/models/Resource";
import { SiteSetting } from "../lib/models/SiteSetting";
import mongoose from "mongoose";

loadEnvConfig(process.cwd());

const defaults: Record<string, unknown> = {
  "public.brand.name": "Paper Foundation",
  "public.brand.country": "India",
  "public.navigation.join": "Join us",
  "public.navigation.contact": "Contact",
  "public.footer.statement": "PAPER|CAN|BEGIN|AGAIN",
  "public.footer.intro": "One sheet can carry a message, then return as material.",
  "public.footer.body": "Paper records where we have been. Recovery decides where its fibres can go next.",
  "public.footer.action": "Join the work",
  "public.contact.email": "paperfoundationindia@gmail.com",
  "public.home.sections": ["living-cover", "myths", "knowledge", "everywhere", "journey", "games", "india", "community"].map(id => ({ id, enabled: true })),
};

async function seed() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required");
  await connectDB();

  const ownerUsername = process.env.ADMIN_BOOTSTRAP_USERNAME?.trim().toLowerCase();
  const ownerPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  if (!(await AdminUser.exists({})) && ownerUsername && ownerPassword) {
    if (ownerPassword.length < 10) throw new Error("ADMIN_BOOTSTRAP_PASSWORD must be at least 10 characters");
    await AdminUser.create({ username: ownerUsername, name: "Foundation Owner", passwordHash: await bcrypt.hash(ownerPassword, 12), role: "owner", createdBy: "seed" });
  }

  await Promise.all(articleCatalog.map((article, index) => Article.updateOne({ slug: article.slug }, { $setOnInsert: {
    title: article.title, slug: article.slug, category: article.category, format: article.format, excerpt: article.summary,
    body: "", coverImage: articleCoverImage(article), readingMinutes: Number(article.time.match(/\d+/)?.[0] ?? 7), sources: [], tags: [],
    status: "published", featured: article.featured, order: index, publishedAt: new Date(), revisionNote: `Imported from editorial catalog (${article.status})`, lastEditedBy: "seed",
  } }, { upsert: true })));

  await Promise.all(mythCatalog.map((myth, order) => Myth.updateOne({ claim: myth.myth }, { $setOnInsert: {
    claim: myth.myth, verdict: "context", correction: myth.reality, explanation: `${myth.explanation}\n\nIndia context: ${myth.indiaContext}`,
    category: "General", sources: [], tags: [], status: "published", featured: false, order, publishedAt: new Date(), revisionNote: `Imported; reviewed ${myth.reviewed}`, lastEditedBy: "seed",
  } }, { upsert: true })));

  const glossary = Object.entries(glossaryData).flatMap(([letter, items]) => items.map((item, order) => ({ ...item, letter, order, status: "published" })));
  await Promise.all(glossary.map(item => Glossary.updateOne({ term: item.term }, { $setOnInsert: item }, { upsert: true })));
  await Promise.all(resourceCatalog.map((item, order) => Resource.updateOne({ title: item.title }, { $setOnInsert: { ...item, order, status: "published" } }, { upsert: true })));
  await Promise.all(gameCatalog.map((game, order) => GameConfig.updateOne({ gameId: game.id }, { $setOnInsert: { gameId: game.id, title: game.title, subtitle: game.subtitle, description: game.description, instructions: [], duration: game.duration, difficulty: game.difficulty, skill: game.skill, enabled: true, order, content: {}, revisionNote: "Imported from game catalog", lastEditedBy: "seed" } }, { upsert: true })));
  await Promise.all(Object.entries(defaults).map(([key, value]) => SiteSetting.updateOne({ key }, { $setOnInsert: { key, value, description: "Default public website setting", updatedBy: "seed" } }, { upsert: true })));

  const counts = await Promise.all([AdminUser, Article, Myth, Glossary, Resource, GameConfig, SiteSetting].map(model => model.countDocuments()));
  console.log(JSON.stringify({ seeded: true, counts: { administrators: counts[0], articles: counts[1], myths: counts[2], glossary: counts[3], resources: counts[4], games: counts[5], settings: counts[6] } }, null, 2));
}

seed().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
