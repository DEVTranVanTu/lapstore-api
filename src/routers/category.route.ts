import express from "express";
import categoryController from "../controllers/category.controller";

const router = express.Router();

router.route("/").post(categoryController.createCategory);

router.route("/").get(categoryController.getCategory);

router.route("/nav").get(categoryController.getCategoryNav);

router.route("/:id").get(categoryController.getCategoryById);

router.route("/:id").put(categoryController.updateCategory);

router.route("/active/:id").put(categoryController.updateStatus);

router.route("/:id").delete(categoryController.deleteCategory);

export const CategoriesRoute = router;
