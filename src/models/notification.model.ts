import mongoose, { Schema } from "mongoose";

export interface INotification extends Document {
  userId: string;
  image: string;
  typeOfNotification: string;
  status: string;
  message: string;
  idToReview: string;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    typeOfNotification: { type: String },
    image: { type: String },
    message: { type: String },
    idToReview: { type: String },
    status: { type: String, default: "active" },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d",
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);
