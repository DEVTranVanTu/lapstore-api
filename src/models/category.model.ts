import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
  categoryName: string;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    categoryName: { type: String, required: true, unique: true },
    active: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICategory>("Category", CategorySchema);
