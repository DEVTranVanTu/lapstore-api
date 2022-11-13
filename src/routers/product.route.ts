import express from "express";
import productController from "../controllers/product.controller";

const router = express.Router();

router.route("/").post(productController.createProduct);

router.route("/").get(productController.getProducts);

router.route("/sub/:id").get(productController.getProductsBySub);

router.route("/:id").get(productController.getProductById);

router.route("/selling/top").get(productController.topProducts);

router.route("/selling/top_discount").get(productController.topSelling);

router.route("/:id").put(productController.updateProduct);

router.route("/:id").delete(productController.deleteProduct);

export const ProductRoute = router;
