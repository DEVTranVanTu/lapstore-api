import { Request } from "express";
import categoryModel from "../models/category.model";
import reviewModel from "../models/review.model";
import subcategoryModel from "../models/subcategory.model";

const createReview = async (req: Request) => {
  const { review,rating,userName,userId,userAvatar,product } = req.body
  const newReview = new reviewModel({
    review:review,
    rating:rating,
    product:product,
    userName,
    userId,
    userAvatar
  });
  return await newReview.save();
};

const getReviewByProductId = async (id: string) => {
  let reviews = null;
  await reviewModel
    .find({product:id})
    .then((data) => {
      if (!data) {
        reviews=[]
      } else {
        reviews = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return reviews;
};

const updateSubCategory = async (req: Request) => {
  const { subCategoryName } = req.body;
  const check = await subcategoryModel.findOne({ subCategoryName });
  if (check) {
    throw {
      status: 409,
      message: "The subCategory name already exists!",
    };
  }
  let success = false;
  const id = req.params.id;
  await subcategoryModel
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "SubCategory not found",
        };
      } else {
        success = true;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return success;
};

const updateStatusSubCategory = async (req: Request) => {
  const { subCategoryName } = req.body;
  const active = req.body.active;

  const check = await subcategoryModel.findOne({ subCategoryName });
  if (check) {
    throw {
      status: 409,
      message: "The subCategory name already exists!",
    };
  }
  let success = false;
  const id = req.params.id;
  await subcategoryModel
    .findByIdAndUpdate(id, { active })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "SubCategory not found",
        };
      } else {
        success = true;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return success;
};

const deleteSubCategory = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await subcategoryModel
    .findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "SubCategory not found",
        };
      } else {
        success = true;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return success;
};

export default {
  createReview,
  updateStatusSubCategory,
  getReviewByProductId,
  updateSubCategory,
  deleteSubCategory,
};
