import { Request, Response } from "express";
import cartService from "../services/cart.service";

const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body;
    if (!productId || !quantity || !userId) {
      res.status(400).send({ message: "productId, user or quantity is empty" });
      return;
    }
    const cart = await cartService.addToCart({ productId, quantity, userId });
    res.status(200).json({
      success: true,
      message: "Add to cart successfully!",
      data: cart,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

export default {
  addToCart,
};
