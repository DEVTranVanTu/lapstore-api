import mongoose, { Document, Schema } from "mongoose";
import { IProduct } from "./product.model";

export interface IReview extends Document {
  userName: string;
  userAvatar: string;
  userId: string;
  product: IProduct;
  review: string;
  rating: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema: Schema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    review: { type: String },
    userName: { type: String, required: true },
    userId: { type: String, required: true },
    userAvatar: { type: String },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IReview>("Reviews", reviewSchema);
