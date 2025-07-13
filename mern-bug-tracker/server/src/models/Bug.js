const mongoose = require('mongoose');

const bugSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'critical'],
      message: 'Severity must be one of: low, medium, high, critical'
    },
    default: 'medium'
  },
  status: {
    type: String,
    enum: {
      values: ['open', 'in-progress', 'resolved', 'closed'],
      message: 'Status must be one of: open, in-progress, resolved, closed'
    },
    default: 'open'
  },
  priority: {
    type: String,
    enum: {
      values: ['low', 'medium', 'high', 'urgent'],
      message: 'Priority must be one of: low, medium, high, urgent'
    },
    default: 'medium'
  },
  reporter: {
    type: String,
    required: [true, 'Reporter is required'],
    trim: true,
    minlength: [2, 'Reporter name must be at least 2 characters long'],
    maxlength: [50, 'Reporter name cannot exceed 50 characters']
  },
  assignee: {
    type: String,
    trim: true,
    maxlength: [50, 'Assignee name cannot exceed 50 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [20, 'Tag cannot exceed 20 characters']
  }],
  stepsToReproduce: [{
    type: String,
    trim: true,
    maxlength: [200, 'Step cannot exceed 200 characters']
  }],
  environment: {
    browser: { type: String, trim: true },
    os: { type: String, trim: true },
    version: { type: String, trim: true }
  },
  attachments: [{
    filename: String,
    url: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  comments: [{
    author: {
      type: String,
      required: true,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dueDate: {
    type: Date,
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  resolvedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bugSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Set resolvedAt when status changes to resolved
  if (this.status === 'resolved' && !this.resolvedAt) {
    this.resolvedAt = new Date();
  }
  
  next();
});

// Add index for better query performance
bugSchema.index({ status: 1, priority: 1 });
bugSchema.index({ reporter: 1 });
bugSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Bug', bugSchema);
