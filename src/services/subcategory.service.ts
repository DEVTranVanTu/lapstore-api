import { Request } from "express";
import categoryModel from "../models/category.model";
import subcategoryModel from "../models/subcategory.model";

const createSubCategory = async (req: Request) => {
  const { subCategoryName } = req.body;
  const check = await subcategoryModel.findOne({ subCategoryName });
  if (check) {
    throw {
      status: 409,
      message: "The subcategory name already exists!",
    };
  }
  const newSubCategory = new subcategoryModel({
    subCategoryName: req.body.subCategoryName,
    category: req.body.category,
  });
  return await newSubCategory.save();
};

const getSubCategory = async (req: Request) => {
  let subCategories = null;
  const active = req.query.active;

  await subcategoryModel
    .find({ active: active ? active : { $in: [0, 1] } })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "SubCategory not found",
        };
      } else {
        subCategories = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return subCategories;
};

const getSubCategoryByCT = async (id: string, active: any) => {
  let subCategories = null;
  let categoryNav = null;

  const check = (await categoryModel.findById(id)).categoryName;

  if (check) {
    await subcategoryModel
      .find({ active: active ? active : { $in: [0, 1] } })
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "SubCategory not found",
          };
        } else {
          subCategories = data.filter(function (e) {
            return e.category._id == id;
          });
          categoryNav = {
            categoryName: check,
            data: subCategories,
          };
        }
      })
      .catch((error) => {
        throw {
          status: error.status || 500,
          success: false,
          message: error.message,
        };
      });
  } else {
    throw {
      status: 409,
      message: "SubCategory is empty!",
    };
  }

  return categoryNav;
};

const getSubCategoryById = async (id: string) => {
  let subCategory = null;
  await subcategoryModel
    .findById(id)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "SubCategory not found",
        };
      } else {
        subCategory = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return subCategory;
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
  createSubCategory,
  getSubCategory,
  getSubCategoryByCT,
  updateStatusSubCategory,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory,
};
