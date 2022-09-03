import mongoose, { Schema } from "mongoose";

export type reservation = {
  productId: string;
  userId: string;
  quantity: number;
};

export interface IIventory extends Document {
  productId: string;
  quantity: number;
  productName: string;
  reservations: reservation[];
  createdAt: Date;
  updatedAt: Date;
}

const iventorySchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, require: true },
    quantity: { type: Number, require: true },
    reservations: { type: Array },
    create_at: { type: Date, default: Date.now() },
  },
  { timestamps: true }
);

export default mongoose.model<IIventory>("Iventory", iventorySchema);
