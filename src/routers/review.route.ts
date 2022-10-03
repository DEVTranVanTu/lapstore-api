import express from "express";
import reviewController from "../controllers/review.controller";

const router = express.Router();

router.route("/").post(reviewController.createReview);

router.route("/PD/:id").get(reviewController.getReviewByProductId);

router.route("/CT/:id").get(reviewController.getSubCategoryByCT);

router.route("/:id").get(reviewController.getSubCategoryById);

router.route("/:id").put(reviewController.updateSubCategory);

router.route("/active/:id").put(reviewController.updateStatusSubCategory);

router.route("/:id").delete(reviewController.deleteSubCategory);

export const ReviewRouter = router;
