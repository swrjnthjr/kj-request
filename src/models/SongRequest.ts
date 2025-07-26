import mongoose, { Document, Schema } from 'mongoose';

export interface ISongRequest extends Document {
  name: string;
  song: string;
  artist: string;
  message?: string;
  status: 'Pending' | 'Taken';
  createdAt: Date;
}

const SongRequestSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
      trim: true,
    },
    song: {
      type: String,
      required: [true, 'Please provide the song title'],
      trim: true,
    },
    artist: {
      type: String,
      required: [true, 'Please provide the artist name'],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Taken'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.models.SongRequest || mongoose.model<ISongRequest>('SongRequest', SongRequestSchema);
