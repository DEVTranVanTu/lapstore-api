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
    const orders = await orderService.listAllOrders(req);
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

const updateStatusOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    const order = await orderModel.findById(id);
    if (order && status && order.status !== 3 && status !== 3) {
      await orderService.updateStatusOrder(req);
      res.status(200).json({
        success: true,
        message: "Change status successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Can not change status for this order!",
      });
    }
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const updateShippingAddress = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const order = await orderModel.findById(id);
    if (order && order.status !== 3 && order.status !== 2) {
      await orderService.updateShippingAddress(req);
      res.status(200).json({
        success: true,
        message: "Change address successfully!",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Can not change address for this order!",
      });
    }
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const product = await orderService.getOrderById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};
export default {
  getOrderById,
  payment,
  listOrderByUser,
  listAllOrders,
  updateStatusOrder,
  cancelOrder,
  updateShippingAddress,
};
