import { Request, Response } from "express";
import reviewService from "../services/review.service";

import subCategoryService from "../services/subcategory.service";

const createReview = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: "Content can not empty" });
      return;
    }
    const review = await reviewService.createReview(req);
    res.status(200).json({
      success: true,
      message: "Comment successfully!",
      data: review,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getReviewByProductId = async (req: Request, res: Response) => {
  try {
    const reviews = await reviewService.getReviewByProductId(req.params.id);
    res.status(200).send(reviews);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const getSubCategoryByCT = async (req: Request, res: Response) => {
  try {
    const active = req.query.active;
    const subCategories = await subCategoryService.getSubCategoryByCT(
      req.params.id,
      active
    );
    res.status(200).send(subCategories);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const getSubCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await subCategoryService.getSubCategoryById(req.params.id);
    res.status(200).send(category);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const updateSubCategory = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await subCategoryService.updateSubCategory(req);
    const subCategories = await subCategoryService.getSubCategoryById(
      req.params.id
    );
    res.status(200).json({
      success: result,
      message: "SubCategory updated successfully",
      data: subCategories,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(error.status)
        .json({ success: error.success, message: error.message });
    }
  }
};

const updateStatusSubCategory = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await subCategoryService.updateStatusSubCategory(req);
    const subCategories = await subCategoryService.getSubCategoryById(
      req.params.id
    );
    res.status(200).json({
      success: result,
      message: "SubCategory updated successfully",
      data: subCategories,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(error.status)
        .json({ success: error.success, message: error.message });
    }
  }
};

const deleteSubCategory = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not empty" });
  }
  try {
    const result = await subCategoryService.deleteSubCategory(req);
    res
      .status(200)
      .json({ success: result, message: "SubCategory deleted successfully" });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res
        .status(error.status)
        .json({ success: error.success, message: error.message });
    }
  }
};

export default {
  createReview,
  getReviewByProductId,
  updateStatusSubCategory,
  getSubCategoryByCT,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
