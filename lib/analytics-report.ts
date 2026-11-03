import { connectDB } from "@/lib/db";
import { Analytics } from "@/lib/models/Analytics";

/**
 * The analytics aggregation, shared by the API route and by the admin page
 * that renders the first view on the server.
 *
 * It lives here rather than in the route because the dashboard used to load
 * itself from a client effect after mounting, and on a full page load that
 * update never reached the screen: every figure sat at zero until someone
 * pressed Refresh, which is indistinguishable from a site nobody visits.
 * Rendering the first view on the server removes that failure, and the flash
 * of zeroes that preceded it even when it worked.
 */
export type AnalyticsReport = {
  configured: boolean;
  preview: boolean;
  days: number;
  totals: Record<string, number>;
  eventCounts: { _id: string; count: number }[];
  daily: { _id: string; views: number; interactions: number }[];
  topContent: { _id: { type: string; id: string }; interactions: number; averageDuration: number }[];
};

export function clampDays(value: unknown) {
  const days = Number(value ?? 30);
  if (!Number.isFinite(days)) return 30;
  return Math.min(Math.max(Math.round(days), 1), 365);
}

/**
 * Shown only when no database is configured. The shape matches the real
 * report so the dashboard renders identically, and the caller marks it with a
 * badge so nobody mistakes it for traffic.
 */
export function previewReport(days: number): AnalyticsReport {
  const count = Math.min(days, 45);
  const daily = Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    const rhythm = 72 + ((index * 29) % 47) + Math.round(Math.sin(index / 2) * 18);
    return { _id: date.toISOString().slice(0, 10), views: rhythm, interactions: Math.round(rhythm * (.42 + (index % 4) * .04)) };
  });
  return {
    configured: false,
    preview: true,
    days,
    totals: { page_view: 3428, article_open: 2164, article_complete: 1467, myth_interaction: 1189, game_open: 1049, cta_click: 386 },
    eventCounts: [],
    daily,
    topContent: [
      { _id: { type: "article", id: "paper-isnt-the-problem-waste-is" }, interactions: 842, averageDuration: 438 },
      { _id: { type: "article", id: "india-fibre-basket" }, interactions: 714, averageDuration: 401 },
      { _id: { type: "game", id: "truth-press" }, interactions: 286, averageDuration: 164 },
      { _id: { type: "myth", id: "fresh-fibre-and-recycling" }, interactions: 252, averageDuration: 86 },
      { _id: { type: "game", id: "hidden-paper" }, interactions: 241, averageDuration: 198 },
    ],
  };
}

export async function analyticsReport(days: number): Promise<AnalyticsReport> {
  if (!process.env.MONGODB_URI) return previewReport(days);

  await connectDB();
  const since = new Date(Date.now() - days * 86_400_000);
  const [eventCounts, daily, topContent] = await Promise.all([
    Analytics.aggregate([
      { $match: { occurredAt: { $gte: since } } },
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    Analytics.aggregate([
      { $match: { occurredAt: { $gte: since } } },
      { $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$occurredAt" } },
        views: { $sum: { $cond: [{ $eq: ["$event", "page_view"] }, 1, 0] } },
        interactions: { $sum: { $cond: [{ $ne: ["$event", "page_view"] }, 1, 0] } },
      } },
      { $sort: { _id: 1 } },
    ]),
    Analytics.aggregate([
      { $match: { occurredAt: { $gte: since }, contentId: { $exists: true, $ne: "" } } },
      { $group: { _id: { type: "$contentType", id: "$contentId" }, interactions: { $sum: 1 }, averageDuration: { $avg: "$durationSeconds" } } },
      { $sort: { interactions: -1 } },
      { $limit: 20 },
    ]),
  ]);

  return {
    configured: true,
    preview: false,
    days,
    totals: Object.fromEntries(eventCounts.map(item => [item._id, item.count])),
    eventCounts,
    daily,
    topContent,
  };
}
