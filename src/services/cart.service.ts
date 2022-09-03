import cartModel from "../models/cart.model";

import inventoryModel from "../models/inventory.model";

const addToCart = async ({ productId, userId, quantity }) => {
  const stock = await inventoryModel.updateOne(
    {
      productId,
      quantity: { $gt: quantity },
    },
    {
      $inc: {
        quantity: -quantity,
      },
      $push: {
        reservations: {
          userId,
          quantity,
        },
      },
    }
  );
  if (stock.modifiedCount) {
    await cartModel.findOneAndUpdate(
      {
        userId,
      },
      {
        $push: {
          products: {
            productId,
            quantity,
          },
        },
      },
      {
        upsert: true,
        new: true,
      }
    );
  }
};

export default {
  addToCart,
};
