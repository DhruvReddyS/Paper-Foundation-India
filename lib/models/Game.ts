import mongoose from 'mongoose';
const GameSchema = new mongoose.Schema({ name: String });
export const Game = mongoose.models.Game || mongoose.model('Game', GameSchema);
