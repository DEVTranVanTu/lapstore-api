import mongoose, { Document, Schema } from "mongoose";
import { ICategory } from "./category.model";
export interface ISubCategory extends Document {
  _id: string;
  subCategoryName: string;
  category: ICategory;
  active: number;
  createdAt: Date;
  updatedAt: Date;
}

const SubCategorySchema: Schema = new Schema(
  {
    subCategoryName: { type: String, required: true, unique: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    active: { type: Number, default: 1 },
  },
  { timestamps: true }
);

export default mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
