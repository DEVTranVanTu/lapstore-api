import { Request, Response } from "express";
import cartModel from "../models/cart.model";
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

export default {
  payment,
};
