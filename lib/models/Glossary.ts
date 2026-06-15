import mongoose from 'mongoose';
const GlossarySchema = new mongoose.Schema({ name: String });
export const Glossary = mongoose.models.Glossary || mongoose.model('Glossary', GlossarySchema);
