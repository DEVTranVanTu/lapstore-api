import { Request, Response } from "express";

import brandService from "../services/brand.service";

const createBrand = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: "Content can not empty" });
      return;
    }
    const brand = await brandService.createBrand(req);
    res.status(200).json({
      success: true,
      message: "Create Brand successfully!",
      data: brand,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await brandService.getBrands(req);
    res.status(200).send(brands);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const getBrandById = async (req: Request, res: Response) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    res.status(200).send(brand);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const updateBrand = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await brandService.updateBrand(req);
    const Brand = await brandService.getBrandById(req.params.id);
    res.status(200).json({
      success: result,
      message: "Brand updated successfully",
      data: Brand,
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

const deleteBrand = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not empty" });
  }
  try {
    const result = await brandService.deleteBrand(req);
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

const unActiveBrand = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await brandService.unActiveBrand(req);
    const Brand = await brandService.getBrandById(req.params.id);
    res.status(200).json({
      success: result,
      message: "Brand updated successfully",
      data: Brand,
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

export default {
  createBrand,
  getBrands,
  getBrandById,
  unActiveBrand,
  updateBrand,
  deleteBrand,
};
