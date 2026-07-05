import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'offered', 'hired', 'rejected'],
    default: 'pending'
  },
  coverLetter: String,
  resume: String,
  expectedSalary: Number,
  availability: Date,
  notes: String,
  interviews: [
    {
      date: Date,
      type: {
        type: String,
        enum: ['phone', 'video', 'onsite'],
        default: 'video'
      },
      notes: String,
      status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled'],
        default: 'scheduled'
      }
    }
  ],
  appliedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;