import mongoose from 'mongoose';
const MythSchema = new mongoose.Schema({ name: String });
export const Myth = mongoose.models.Myth || mongoose.model('Myth', MythSchema);
