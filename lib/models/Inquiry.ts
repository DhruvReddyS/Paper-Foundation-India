import mongoose from 'mongoose';
const InquirySchema = new mongoose.Schema({ name: String });
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
