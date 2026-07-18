import { gameCatalog, gameIds } from "@/components/games/gameCatalog";
import { connectDB } from "@/lib/db";
import { GameResult } from "@/lib/models/Game";
import { NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resultSchema = z
  .object({
    sessionId: z.string().uuid(),
    gameId: z.enum(gameIds),
    score: z.number().int().nonnegative(),
    outOf: z.number().int().positive().max(100_000),
    durationSeconds: z.number().int().nonnegative().max(7_200),
    metrics: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  })
  .refine((result) => result.score <= result.outOf, {
    message: "Score cannot exceed the maximum score.",
    path: ["score"],
  });

export async function GET() {
  if (!process.env.MONGODB_URI) {
    return NextResponse.json({
      games: gameCatalog,
      statistics: [],
      source: "catalog",
    });
  }

  await connectDB();
  const statistics = await GameResult.aggregate([
    {
      $group: {
        _id: "$gameId",
        plays: { $sum: 1 },
        averagePercent: {
          $avg: { $multiply: [{ $divide: ["$score", "$outOf"] }, 100] },
        },
        fastestSeconds: { $min: "$durationSeconds" },
      },
    },
    { $project: { _id: 0, gameId: "$_id", plays: 1, averagePercent: 1, fastestSeconds: 1 } },
  ]);

  return NextResponse.json({ games: gameCatalog, statistics, source: "database" });
}

export async function POST(request: Request) {
  const payload = resultSchema.safeParse(await request.json().catch(() => null));
  if (!payload.success) {
    return NextResponse.json(
      { error: "Invalid game result", issues: payload.error.flatten() },
      { status: 400 }
    );
  }

  if (!process.env.MONGODB_URI) {
    return NextResponse.json(
      { accepted: true, persisted: false, result: payload.data },
      { status: 202 }
    );
  }

  await connectDB();
  const result = await GameResult.findOneAndUpdate(
    { sessionId: payload.data.sessionId },
    { $setOnInsert: { ...payload.data, completedAt: new Date() } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).lean();

  return NextResponse.json({ accepted: true, persisted: true, result }, { status: 201 });
}
