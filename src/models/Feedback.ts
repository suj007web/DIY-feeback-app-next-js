import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeedback extends Document {
  name: string;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  feedback: {
    type: String,
    required: [true, 'Please provide feedback'],
    maxlength: [1000, 'Feedback cannot be more than 1000 characters'],
  },
}, {
  timestamps: true,
});

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;