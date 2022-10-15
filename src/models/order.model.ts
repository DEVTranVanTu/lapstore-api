import mongoose, { Schema } from "mongoose";

type product = {
  productId: string;
  quantity: number;
};

export interface IOrder extends Document {
  userId: string;
  cartId: string;
  shipping: object;
  payment: object;
  products: product[];
  status: number;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      require: true,
    },
    shipping: Object,
    payment: Object,
    products: Array,
    status: {
      type: Number,
      enum: [0, 1, 2, 3],
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
