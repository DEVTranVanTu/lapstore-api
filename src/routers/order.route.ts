import express from "express";
import orderController from "../controllers/order.controller";

const router = express.Router();

router.route("/payment").post(orderController.payment);

export const OrderRoute = router;
