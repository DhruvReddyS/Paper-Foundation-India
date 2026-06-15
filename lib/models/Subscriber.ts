import mongoose from 'mongoose';
const SubscriberSchema = new mongoose.Schema({ name: String });
export const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', SubscriberSchema);
