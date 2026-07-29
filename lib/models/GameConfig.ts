import mongoose from "mongoose";

const GameConfigSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  subtitle: String,
  description: String,
  instructions: [String],
  duration: String,
  difficulty: String,
  skill: String,
  enabled: { type: Boolean, default: true, index: true },
  order: { type: Number, default: 0, index: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} },
  revision: { type: Number, default: 1 },
  revisionNote: String,
  lastEditedBy: String,
}, { timestamps: true });

export const GameConfig = mongoose.models.GameConfig || mongoose.model("GameConfig", GameConfigSchema);
