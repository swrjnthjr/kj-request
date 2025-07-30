import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRequestStatus extends Document {
  open: boolean;
  updatedAt: Date;
}

const RequestStatusSchema = new Schema<IRequestStatus>({
  open: { type: Boolean, required: true, default: false },
  updatedAt: { type: Date, default: Date.now },
});

export default (mongoose.models.RequestStatus as Model<IRequestStatus>) ||
  mongoose.model<IRequestStatus>("RequestStatus", RequestStatusSchema);
