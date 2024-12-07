import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  },
  loginStreak: {
    type: Number,
    default: 1
  },
  coins: {
    type: Number,
    default: 10
  },
  addresses: [{
    name: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: Boolean
  }],
  orders: [{
    orderId: String,
    date: Date,
    items: Array,
    total: Number,
    status: String
  }],
  events: [{
    date: String,
    occasion: String,
    name: String,
    notes: String,
    recurrence: {
      type: String,
      enum: ['once', 'weekly', 'monthly', 'yearly']
    }
  }]
}, {
  timestamps: true
});

// Add index for email
userSchema.index({ email: 1 });

export default mongoose.model('User', userSchema);