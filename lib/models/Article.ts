import mongoose from 'mongoose';
const ArticleSchema = new mongoose.Schema({ name: String });
export const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);
