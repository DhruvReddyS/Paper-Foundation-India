import mongoose from "mongoose";

const GameResultSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    gameId: { type: String, required: true, index: true },
    score: { type: Number, required: true, min: 0 },
    outOf: { type: Number, required: true, min: 1 },
    durationSeconds: { type: Number, required: true, min: 0 },
    metrics: { type: mongoose.Schema.Types.Mixed, default: {} },
    completedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const GameResult =
  mongoose.models.GameResult ||
  mongoose.model("GameResult", GameResultSchema);
