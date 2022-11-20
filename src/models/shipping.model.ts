import mongoose, { Schema } from "mongoose";

export interface shippingAddress {
  shipping_name: string;
  shipping_phone: string;
  shipping_province: object;
  shipping_district: object;
  shipping_ward: object;
  shipping_address: string;
}
export interface IShipping extends Document {
  userId: string;
  shipping: shippingAddress;
}

const shippingSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shipping: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model<IShipping>("Shipping", shippingSchema);
