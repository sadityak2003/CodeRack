import mongoose from 'mongoose';

const SolutionSchema = new mongoose.Schema({
  contributor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  email : { type: String, required: true },
  title: { type: String, required: true },
  platform: { type: String, required: true },
  language: { type: String, required: true },
  codeSnippet: { type: String, required: true },
  description: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.Solution || mongoose.model('Solution', SolutionSchema);
