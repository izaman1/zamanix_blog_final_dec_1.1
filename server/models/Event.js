import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  occasion: {
    type: String,
    required: true,
    enum: ['birthday', 'anniversary', 'engagement', 'wedding', 'other']
  },
  name: String,
  notes: String,
  recurrence: {
    type: String,
    enum: ['once', 'weekly', 'monthly', 'yearly'],
    default: 'once'
  },
  calendarSync: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Event', eventSchema);