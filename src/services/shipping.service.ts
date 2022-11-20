import { Request } from "express";
import shippingModel from "../models/shipping.model";

const createShipping = async (req: Request) => {
  const shipping = new shippingModel({
    userId: req.body.userId,
    shipping: req.body.shipping,
  });
  return await shipping.save();
};

const getListShippingByUser = async (req: Request) => {
  let shipping = null;
  const userId = req.params.id;

  await shippingModel
    .find({ userId: userId })
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Shipping address not found",
        };
      } else {
        shipping = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return shipping;
};

const getShippingById = async (id: string) => {
  let shipping = null;
  await shippingModel
    .findById(id)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Shipping not found",
        };
      } else {
        shipping = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return shipping;
};

const updateShipping = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await shippingModel
    .findByIdAndUpdate(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Shipping not found",
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

const deleteShipping = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await shippingModel
    .findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Shipping not found",
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
  createShipping,
  getListShippingByUser,
  getShippingById,
  updateShipping,
  deleteShipping,
};
