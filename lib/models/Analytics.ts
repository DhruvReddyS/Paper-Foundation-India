import mongoose from 'mongoose';
const AnalyticsSchema = new mongoose.Schema({ name: String });
export const Analytics = mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema);
