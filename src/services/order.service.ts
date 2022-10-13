import { Request } from "express";
import cartModel from "../models/cart.model";
import inventoryModel from "../models/inventory.model";
import orderModel from "../models/order.model";

const payment = async (req: Request) => {
  const newOrder = new orderModel(req.body);
  const order = await newOrder.save();
  if (order) {
    const userId = order.userId.toString();
    const productIds = order.products.map((product) => product.productId);

    for (const productId of productIds) {
      await inventoryModel.updateOne(
        {
          productId: productId,
          "reservations.userId": userId,
        },
        {
          $pull: {
            reservations: {
              userId: userId,
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );

      await cartModel.updateOne(
        {
          userId: userId,
          "products.productId": productId,
        },
        {
          $pull: {
            products: {
              productId: productId,
            },
          },
        },
        {
          upsert: true,
          new: true,
        }
      );
    }
  }
};

export default {
  payment,
};
