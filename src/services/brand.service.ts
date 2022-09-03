import { Request } from "express";
import Brand from "../models/brand.model";

const createBrand = async (req: Request) => {
  const { brandName } = req.body;
  const check = await Brand.findOne({ brandName });
  if (check) {
    throw {
      status: 409,
      message: "The Brand name already exists!",
    };
  }
  const brand = new Brand({
    brandName: req.body.brandName,
    brandThumbnail: req.body.brandThumbnail,
  });
  return await brand.save();
};

const getBrands = async (req: Request) => {
  let brands = null;
  const active = req.query.active;

  await Brand.find({ active: active ? active : { $in: [0, 1] } })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Brand not found",
        };
      } else {
        brands = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return brands;
};

const getBrandById = async (id: string) => {
  let brand = null;
  await Brand.findById(id)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Brand not found",
        };
      } else {
        brand = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return brand;
};

const updateBrand = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await Brand.findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Brand not found",
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

const unActiveBrand = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  const active = req.body.active;
  await Brand.findByIdAndUpdate(id, { active })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Brand not found",
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

const deleteBrand = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await Brand.findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Brand not found",
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
  createBrand,
  getBrands,
  unActiveBrand,
  getBrandById,
  updateBrand,
  deleteBrand,
};
