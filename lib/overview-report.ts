import { connectDB } from "@/lib/db";
import { Analytics } from "@/lib/models/Analytics";
import { Article } from "@/lib/models/Article";
import { GameResult } from "@/lib/models/Game";
import { Inquiry } from "@/lib/models/Inquiry";
import { Myth } from "@/lib/models/Myth";
import { Subscriber } from "@/lib/models/Subscriber";
import { articleCatalog } from "@/content/articleCatalog";

/**
 * The dashboard summary, shared by the API route and by the admin page that
 * renders the first view on the server.
 *
 * Same reason as lib/analytics-report: loading this from a client effect left
 * every figure at zero on a full page load, so the first screen an
 * administrator sees reported an empty site while the database held 35
 * published articles.
 */
export type OverviewReport = {
  configured: boolean;
  preview: boolean;
  counts: { articles?: Record<string, number>; myths?: Record<string, number>; openInquiries?: number; subscribers?: number };
  topArticles: { _id: string; views: number; completions: number; averageDuration: number }[];
  games: { _id: string; plays: number; averageScore: number; averageDuration: number }[];
  recentInquiries: { _id: string; name: string; type: string; subject: string; status: string; createdAt: string }[];
};

/** Shown only when no database is configured, and badged as such by the caller. */
export function previewOverview(): OverviewReport {
  const published = articleCatalog.filter(article => article.status === "published").length;
  const review = articleCatalog.length - published;
  const now = new Date().toISOString();
  return {
    configured: false,
    preview: true,
    counts: { articles: { published, review }, myths: { review: 42 }, openInquiries: 6, subscribers: 284 },
    topArticles: [
      { _id: "paper-isnt-the-problem-waste-is", views: 842, completions: 601, averageDuration: 438 },
      { _id: "india-fibre-basket", views: 714, completions: 522, averageDuration: 401 },
      { _id: "science-behind-paper-recycling", views: 566, completions: 352, averageDuration: 367 },
      { _id: "hidden-infrastructure-waste-paper", views: 439, completions: 318, averageDuration: 416 },
      { _id: "credible-paper-claims-checklist", views: 361, completions: 285, averageDuration: 298 },
    ],
    games: [
      { _id: "truth-press", plays: 286, averageScore: 78, averageDuration: 164 },
      { _id: "hidden-paper", plays: 241, averageScore: 72, averageDuration: 198 },
      { _id: "grow-or-shred", plays: 207, averageScore: 81, averageDuration: 143 },
      { _id: "mill-master", plays: 166, averageScore: 69, averageDuration: 224 },
      { _id: "paper-word-search", plays: 149, averageScore: 76, averageDuration: 187 },
    ],
    recentInquiries: [
      { _id: "preview-1", name: "School programme lead", type: "join", subject: "Classroom paper literacy workshop", status: "new", createdAt: now },
      { _id: "preview-2", name: "Packaging researcher", type: "report", subject: "Claim submitted for evidence review", status: "reviewing", createdAt: now },
      { _id: "preview-3", name: "Reader", type: "contact", subject: "Question about recovered fibre", status: "new", createdAt: now },
    ],
  };
}

export async function overviewReport(): Promise<OverviewReport> {
  if (!process.env.MONGODB_URI) return previewOverview();

  await connectDB();
  const since = new Date(Date.now() - 30 * 86_400_000);
  const [articleCounts, mythCounts, openInquiries, subscribers, topArticles, games, recentInquiries] = await Promise.all([
    Article.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Myth.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Inquiry.countDocuments({ status: { $in: ["new", "reviewing"] } }),
    Subscriber.countDocuments({ status: "active" }),
    Analytics.aggregate([
      { $match: { occurredAt: { $gte: since }, contentType: "article" } },
      { $group: {
        _id: "$contentId",
        views: { $sum: { $cond: [{ $in: ["$event", ["page_view", "article_open"]] }, 1, 0] } },
        completions: { $sum: { $cond: [{ $eq: ["$event", "article_complete"] }, 1, 0] } },
        averageDuration: { $avg: "$durationSeconds" },
      } },
      { $sort: { views: -1 } },
      { $limit: 6 },
    ]),
    GameResult.aggregate([
      { $match: { completedAt: { $gte: since } } },
      { $group: {
        _id: "$gameId",
        plays: { $sum: 1 },
        averageScore: { $avg: { $multiply: [{ $divide: ["$score", "$outOf"] }, 100] } },
        averageDuration: { $avg: "$durationSeconds" },
      } },
      { $sort: { plays: -1 } },
    ]),
    Inquiry.find().sort({ createdAt: -1 }).limit(6).lean(),
  ]);

  return {
    configured: true,
    preview: false,
    counts: {
      articles: Object.fromEntries(articleCounts.map(item => [item._id, item.count])),
      myths: Object.fromEntries(mythCounts.map(item => [item._id, item.count])),
      openInquiries,
      subscribers,
    },
    topArticles,
    games,
    // Serialised for the client component, which receives this from the server.
    recentInquiries: JSON.parse(JSON.stringify(recentInquiries)),
  };
}
