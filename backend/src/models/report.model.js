import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  generatedAt: {
    type: Date,
    default: Date.now,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);

export default Report;