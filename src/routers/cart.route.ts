import express from "express";
import cartController from "../controllers/cart.controller";

const router = express.Router();

router.route("/").post(cartController.addToCart);

export const CartRoute = router;
