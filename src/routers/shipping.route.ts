import express from "express";
import shippingController from "../controllers/shipping.controller";

const router = express.Router();

router.route("/").post(shippingController.createShipping);

router.route("/user/:id").get(shippingController.getShippingByUser);

router.route("/:id").get(shippingController.getShippingById);

router.route("/:id").put(shippingController.updateShipping);

router.route("/:id").delete(shippingController.deleteShipping);

export const ShippingRouter = router;
