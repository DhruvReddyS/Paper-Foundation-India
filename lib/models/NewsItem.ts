import mongoose from 'mongoose';
const NewsItemSchema = new mongoose.Schema({ name: String });
export const NewsItem = mongoose.models.NewsItem || mongoose.model('NewsItem', NewsItemSchema);
