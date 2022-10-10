import { Request, Response } from "express";
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

const editToCart = async ({ productId, userId, quantity }) => {
  const stock = await inventoryModel.updateOne(
    {
      productId,
      quantity: { $gt: quantity },
    },
    {
      $inc: {
        quantity: +quantity,
      },
      $pull: {
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
        $pull: {
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

const getCartByUserId = async (req: Request, res: Response) => {
  let cart = null;
  const userId = req.params.id;
  await cartModel
    .find({ userId: userId })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Cart not found",
        };
      } else {
        cart = data[0];
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return cart;
};

export default {
  addToCart,
  getCartByUserId,
  editToCart,
};
