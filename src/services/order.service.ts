import { RestoreRequest } from "aws-sdk/clients/s3";
import { Request, Response } from "express";
import cartModel from "../models/cart.model";
import inventoryModel from "../models/inventory.model";
import orderModel from "../models/order.model";
import notificationService from "./notification.service";

const payment = async (req: Request) => {
  const newOrder = new orderModel(req.body);
  const order = await newOrder.save();

  if (order) {
    const userId = order.userId.toString();
    const productIds = order.products.map((product) => product.productId);
    const notification = {
      userId: order.userId,
      message: "Đơn hàng của bạn đã được đặt thành công",
      typeOfNotification: "order",
      image: "",
      status: "active",
      idToReview: order._id,
    };
    await notificationService.addNotification(notification);
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
  const notification = {
    userId: order.userId,
    message: "Bạn hủy đơn hàng thành công",
    typeOfNotification: "order",
    image: "",
    status: "active",
    idToReview: order._id,
  };
  await notificationService.addNotification(notification);
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
  await orderModel.findByIdAndUpdate(id, { status: 3 });
};

const updateStatusOrder = async (req: Request) => {
  const id = req.params.id;
  const status = req.body.status;
  const order = await orderModel.findByIdAndUpdate(id, { status });
  const getMessage = () => {
    if (status === 0) {
      return "Đơn hàng của bạn đang chờ được giao cho người giao hàng.";
    }
    if (status === 1) {
      return "Đơn hàng của bạn đang được giao.";
    }
    if (status === 2) {
      return "Đơn hàng của bạn đã được giao thành công";
    }
  };
  const notification = {
    userId: order.userId,
    message: getMessage(),
    typeOfNotification: "order",
    image: "",
    status: "active",
    idToReview: order._id,
  };
  await notificationService.addNotification(notification);
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
  updateStatusOrder,
  cancelOrder,
};
