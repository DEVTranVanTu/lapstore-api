import { Request, Response } from "express";
import cartModel from "../models/cart.model";
import orderModel from "../models/order.model";
import userModel from "../models/user.model";
import orderService from "../services/order.service";
import { orderValidate } from "../validations/order.validation";

const payment = async (req: Request, res: Response) => {
  try {
    const user = userModel.findOne({ _id: req.body.userId });
    const cart = cartModel.findOne({ _id: req.body.cartId });
    const { error } = orderValidate(req.body);
    if (error || !user || !cart) {
      return res.status(400).send({
        error: "data is invalid!",
      });
    } else {
      await orderService.payment(req);
      res.status(200).json({
        success: true,
        message: "Payment successfully!",
      });
    }
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  }
};

const listOrderByUser = async (req: Request, res: Response) => {
  try {
    const user = await userModel.findOne({ _id: req.params.id });

    if (!user) {
      return res.status(400).send({
        error: "user not found",
      });
    } else {
      const orders = await orderService.listOrderByUser(req);
      res.status(200).json({
        success: true,
        message: "get list order successfully!",
        orders: orders,
      });
    }
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  }
};

const listAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await orderService.listAllOrders();
    res.status(200).json({
      success: true,
      message: "get list order successfully!",
      orders: orders,
    });
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  }
};

const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const order = await orderModel.findOne({ _id: id });
    if (!order) {
      return res.status(400).send({
        error: "Order not found",
      });
    } else {
      await orderService.cancelOrder(req);
      res.status(200).json({
        success: true,
        message: "Cancel order successfully!",
      });
    }
  } catch (error) {
    if (!error.status) {
      return res.status(500).json({ message: error.message });
    } else {
      return res.status(error.status).json({ message: error.message });
    }
  }
};

export default {
  payment,
  listOrderByUser,
  listAllOrders,
  cancelOrder,
};
