import mongoose from 'mongoose';
const CorrectionSchema = new mongoose.Schema({ name: String });
export const Correction = mongoose.models.Correction || mongoose.model('Correction', CorrectionSchema);
