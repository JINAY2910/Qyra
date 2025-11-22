import mongoose from 'mongoose';

const queueItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  type: {
    type: String,
    enum: ['Walk-in', 'VIP', 'Senior'],
    default: 'Walk-in',
    required: true,
  },
  priorityLevel: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['waiting', 'serving', 'completed', 'removed'],
    default: 'waiting',
  },
  tokenNumber: {
    type: String,
    required: true,
  },
  completedAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
queueItemSchema.index({ status: 1, priorityLevel: -1, createdAt: 1 });
queueItemSchema.index({ tokenNumber: 1 }, { unique: true });

const QueueItem = mongoose.model('QueueItem', queueItemSchema);

export default QueueItem;

