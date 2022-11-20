import { Request, Response } from "express";

import shippingService from "../services/shipping.service";

const createShipping = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: "Content can not empty" });
      return;
    }
    await shippingService.createShipping(req);
    res.status(200).json({
      success: true,
      message: "Create shipping successfully!",
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getShippingByUser = async (req: Request, res: Response) => {
  try {
    const brands = await shippingService.getListShippingByUser(req);
    res.status(200).send(brands);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const getShippingById = async (req: Request, res: Response) => {
  try {
    const brand = await shippingService.getShippingById(req.params.id);
    res.status(200).send(brand);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const updateShipping = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await shippingService.updateShipping(req);
    const Shipping = await shippingService.getShippingById(req.params.id);
    res.status(200).json({
      success: result,
      message: "Shipping updated successfully",
      data: Shipping,
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

const deleteShipping = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not empty" });
  }
  try {
    const result = await shippingService.deleteShipping(req);
    res
      .status(200)
      .json({ success: result, message: "Brand deleted successfully" });
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
  createShipping,
  getShippingByUser,
  getShippingById,
  updateShipping,
  deleteShipping,
};
