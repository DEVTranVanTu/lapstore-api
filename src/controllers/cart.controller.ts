import { Request, Response } from "express";
import cartService from "../services/cart.service";

const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity, userId } = req.body;
    if (!productId || !quantity || !userId) {
      res.status(400).send({ message: "productId, user or quantity is empty" });
      return;
    }
    await cartService.addToCart({ productId, quantity, userId });
    res.status(200).json({
      success: true,
      message: "Add to cart successfully!",
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getCartByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      res.status(400).send({ message: "User is empty" });
      return;
    }
    const cart = await cartService.getCartByUserId(req, res);
    res.status(200).json({
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

const removeFromCart = async (req: Request, res: Response) => {
  try {
    const cart = req.body.cart;
    const products = req.body.products;

    if (!cart || products.length <= 0) {
      res.status(400).send({ message: "Data not valid!" });
      return;
    }
    await cartService.removeFromCart(req);
    res.status(200).json({
      success: true,
      message: "Remove from cart successfully!",
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
  getCartByUserId,
  removeFromCart,
};
