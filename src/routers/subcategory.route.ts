import express from "express";
import subCategoryController from "../controllers/subcategory.controller";

const router = express.Router();

router.route("/").post(subCategoryController.createSubCategory);

router.route("/").get(subCategoryController.getSubCategory);

router.route("/CT/:id").get(subCategoryController.getSubCategoryByCT);

router.route("/:id").get(subCategoryController.getSubCategoryById);

router.route("/:id").put(subCategoryController.updateSubCategory);

router.route("/active/:id").put(subCategoryController.updateStatusSubCategory);

router.route("/:id").delete(subCategoryController.deleteSubCategory);

export const SubCategoriesRoute = router;
