import { RestoreRequest } from "aws-sdk/clients/s3";
import { Request, Response } from "express";
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

const cancelOrder = async (req: Request) => {
  const id = req.params.id;
  const order = await orderModel.findOne({ _id: id });

  const products = order.products.map((product) => product);

  for (const product of products) {
    await inventoryModel.updateOne(
      {
        productId: product.productId,
      },
      {
        $inc: {
          quantity: +product.quantity,
        },
      }
    );
  }
  await orderModel.findByIdAndDelete(id);
};

const listOrderByUser = async (req: Request) => {
  const userId = req.params.id;
  let listOrder = null;
  await orderModel
    .find({ userId: userId })
    .then((data) => {
      listOrder = data;
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return listOrder;
};

const listAllOrders = async () => {
  let orders = null;
  await orderModel
    .find()
    .then((data) => {
      orders = data;
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return orders;
};

export default {
  payment,
  listOrderByUser,
  listAllOrders,
  cancelOrder,
};
