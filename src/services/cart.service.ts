import { Request, Response } from "express";
import cartModel from "../models/cart.model";

import inventoryModel from "../models/inventory.model";
import productModel from "../models/product.model";

const getCartByUserId = async (req: Request, res: Response) => {
  let cart = null;
  const userId = req.params.id;
  let newProduct = [];
  await cartModel
    .findOne({ userId: userId })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Cart not found",
        };
      } else {
        cart = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  const products = cart?.products || [];
  if (products) {
    for (const product of products) {
      const productData = await productModel.findOne({
        _id: product.productId,
      });
      const data = {
        product: productData,
        quantity: product.quantity,
      };
      newProduct.push(data);
    }
  }
  const cartData = JSON.parse(JSON.stringify(cart));
  const newCart = {
    ...cartData,
    products: newProduct,
  };

  return newCart;
};

const addToCart = async ({ productId, quantity, userId }) => {
  const cart = await cartModel.findOne({ userId: userId });
  if (cart) {
    let newQuantity = quantity;
    let oldQuantity = 0;
    let index = cart.products.findIndex((v) => v.productId === productId);
    if (index > -1) {
      const qty = cart.products[index].quantity;
      oldQuantity = qty;
      let delta = newQuantity - oldQuantity;

      await cartModel.findOneAndUpdate(
        {
          userId: userId,
          "products.productId": productId,
        },
        {
          $set: {
            modifiedOn: new Date(),
            "products.$.quantity": newQuantity,
          },
        }
      );
      await inventoryModel.findOneAndUpdate(
        {
          productId: productId,
          "reservations.userId": userId,
        },
        {
          $inc: { quantity: -delta },
          $set: {
            "reservations.$.quantity": newQuantity,
            modifiedOn: new Date(),
          },
        }
      );
    } else {
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
    }
  } else {
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
  }
};

const removeFromCart = async (req: Request) => {
  const id = req.body.cart;
  const cart = await cartModel.findOne({ _id: id });
  const userId = cart.userId;

  const products = req.body.products;

  for (const product of products) {
    await inventoryModel.updateOne(
      {
        productId: product.productId,
        "reservations.userId": userId.toString(),
      },
      {
        $inc: {
          quantity: +product.quantity,
        },
        $pull: {
          reservations: {
            userId: userId.toString(),
          },
        },
      }
    );

    await cartModel.updateOne(
      {
        userId: userId,
        "products.productId": product.productId,
      },
      {
        $pull: {
          products: {
            productId: product.productId,
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
  getCartByUserId,
  removeFromCart,
};
