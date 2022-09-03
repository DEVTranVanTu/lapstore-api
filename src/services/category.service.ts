import { Request } from "express";
import Category from "../models/category.model";
import subcategoryModel from "../models/subcategory.model";

const createCategory = async (req: Request) => {
  const { categoryName } = req.body;
  const check = await Category.findOne({ categoryName });
  if (check) {
    throw {
      status: 409,
      message: "The category name already exists!",
    };
  }
  const category = new Category({
    categoryName: req.body.categoryName,
  });
  return await category.save();
};

const getCategory = async (req: Request) => {
  let categories = null;
  const active = req.query.active;

  await Category.find({ active: active ? active : { $in: [0, 1] } })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Category not found",
        };
      } else {
        categories = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return categories;
};

const getCategoryNav = async () => {
  const categoriesNav = await subcategoryModel
    .find()
    .populate("category", "categoryName _id");

  return categoriesNav;
};

const getCategoryById = async (id: string) => {
  let category = null;
  await Category.findById(id)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Category not found",
        };
      } else {
        category = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return category;
};

const updateCategory = async (req: Request) => {
  const { categoryName } = req.body;
  const check = await Category.findOne({ categoryName });
  if (check) {
    throw {
      status: 409,
      message: "The category name already exists!",
    };
  }
  let success = false;
  const id = req.params.id;
  await Category.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Category not found",
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

const updateStatusCategory = async (req: Request) => {
  const { categoryName } = req.body;
  const check = await Category.findOne({ categoryName });
  if (check) {
    throw {
      status: 409,
      message: "The category name already exists!",
    };
  }
  let success = false;
  const id = req.params.id;
  const active = req.body.active;

  await Category.findByIdAndUpdate(id, { active })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Category not found",
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

const deleteCategory = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await Category.findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Category not found",
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
  createCategory,
  getCategory,
  getCategoryNav,
  updateStatusCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
