import mongoose, { Document, Schema } from "mongoose";
import { IBrand } from "./brand.model";

type spec = {
  key: string;
  value: any;
};
export interface IProduct extends Document {
  productName: string;
  productThumbnail: string;
  description: string;
  price: number;
  status: number;
  discount: number;
  subCategory: any[];
  category: any[];
  brand: IBrand;
  specs: spec[];
  ram: String;
  screen: String;
  cpu: String;
}

const ProductSchema: Schema = new Schema(
  {
    productName: { type: String, required: true, unique: true },
    productThumbnail: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    status: { type: Number, default: 0 },
    discount: { type: Number, required: true },
    ram: { type: String },
    screen: { type: String },
    cpu: { type: String },
    subCategory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true,
      },
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    specs: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

ProductSchema.index({ productName: "text", description: "text" });
export default mongoose.model<IProduct>("Product", ProductSchema);
