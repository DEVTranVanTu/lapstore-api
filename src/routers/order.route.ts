import express from "express";
import orderController from "../controllers/order.controller";

const router = express.Router();

router.route("/payment").post(orderController.payment);

router.route("/list").get(orderController.listAllOrders);

router.route("/list/:id").get(orderController.listOrderByUser);

router.route("/cancel/:id").delete(orderController.cancelOrder);

router.route("/update/:id").put(orderController.updateStatusOrder);

export const OrderRoute = router;
