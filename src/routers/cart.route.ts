import express from "express";
import cartController from "../controllers/cart.controller";

const router = express.Router();

router.route("/").post(cartController.addToCart);
router.route("/edit").post(cartController.editToCart);

router.route("/user/:id").get(cartController.getCartByUserId);

export const CartRoute = router;
