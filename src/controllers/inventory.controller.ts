import { Request, Response } from "express";
import brandModel from "../models/brand.model";
import inventoryModel from "../models/inventory.model";
import inventoryService from "../services/inventory.service";

const addInventory = async (req: Request, res: Response) => {
  try {
    const productId = req.body.productId;
    let product = await inventoryModel.find({ productId });
    if (product.length > 0) {
      return res
        .status(422)
        .send({ error: "That product is already in inventory." });
    }
    if (!req.body) {
      res.status(400).send({ message: "Content can not empty" });
      return;
    }
    const inventory = await inventoryService.addIventory(req);
    res.status(200).json({
      success: true,
      message: "Add inventory successfully!",
      data: inventory,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getInventoryById = async (req: Request, res: Response) => {
  try {
    const inventory = await inventoryService.getInventoryById(req.params.id);
    res.status(200).send(inventory);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const updateInventory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let checkInventory = await inventoryModel.find({ _id: id });
    if (checkInventory.length <= 0) {
      return res.status(422).send({ error: "Can not found inventory!" });
    } else {
      const result = await inventoryService.editInventory(req);
      const inventory = await inventoryService.getInventoryById(req.params.id);
      res.status(200).json({
        success: result,
        message: "SubCategory updated successfully",
        data: inventory,
      });
    }
  } catch (error) {}
};

const deleteInventory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    let inventory = await inventoryModel.find({ _id: id });
    if (inventory.length <= 0) {
      return res.status(422).send({ error: "Can not found inventory!" });
    } else {
      const productId = inventory[0].productId;
      const status = await inventoryService.deleteInventory(req, productId);
      res.status(200).send(status);
    }
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

const getListInventory = async (req: Request, res: Response) => {
  try {
    const inventory = await inventoryService.getListInventory(req);
    res.status(200).send(inventory);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

const getInventoryByBrand = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const brand = await brandModel.find({ _id: id });
    if (brand) {
      const inventory = await inventoryService.getInventoryByBrand(req);
      res.status(200).json({
        success: true,
        message: "Get inventory successfully!",
        data: inventory,
      });
    }
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

export default {
  addInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  getListInventory,
  getInventoryByBrand,
};
