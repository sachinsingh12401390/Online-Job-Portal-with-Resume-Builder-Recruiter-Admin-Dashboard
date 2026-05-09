const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a job title']
  },
  company: {
    type: String,
    required: [true, 'Please add a company name']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  description: {
    type: String,
    required: [true, 'Please add a job description']
  },
  requirements: {
    type: [String],
    required: [true, 'Please add job requirements']
  },
  salary: {
    type: String,
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Full-time'
  },
  recruiter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['Applied', 'Reviewed', 'Interview', 'Rejected', 'Accepted'],
      default: 'Applied'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    note: {
      type: String,
      default: ''
    },
    interviewDate: {
      type: String,
      default: ''
    },
    interviewTime: {
      type: String,
      default: ''
    },
    interviewType: {
      type: String,
      default: ''
    },
    interviewLink: {
      type: String,
      default: ''
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', jobSchema);
