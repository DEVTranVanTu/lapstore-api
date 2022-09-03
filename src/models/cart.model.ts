import mongoose, { Schema } from "mongoose";

type product = {
  productId: string;
  quantity: number;
};

export interface ICart extends Document {
  userId: string;
  status: string;
  modifiedOn: Date;
  products: product[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, default: "active" },
    modifiedOn: { type: Date, default: Date.now() },
    products: Array,
  },
  { timestamps: true }
);

export default mongoose.model<ICart>("Cart", cartSchema);
