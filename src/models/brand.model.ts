import mongoose, { Document, Schema } from "mongoose";

export interface IBrand extends Document {
  brandName: string;
  brandThumnail: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
  {
    brandName: { type: String, required: true, unique: true },
    brandThumbnail: { type: String, required: true },
    active: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBrand>("Brand", BrandSchema);
