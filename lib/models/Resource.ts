import mongoose from 'mongoose';
const ResourceSchema = new mongoose.Schema({ name: String });
export const Resource = mongoose.models.Resource || mongoose.model('Resource', ResourceSchema);
