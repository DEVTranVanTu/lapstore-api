import { Request, Response } from "express";
import productService from "../services/product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      res.status(400).send({ message: "Content can not empty" });
      return;
    }
    const product = await productService.createProduct(req);
    res.status(200).json({
      success: true,
      message: "Create category successfully!",
      data: product,
    });
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.status(error.status).json({ success: false, message: error.message });
    }
  }
};

const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProducts(req);
    res.status(200).send(products);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
  return productService.getProducts(req);
};

const getProductsBySub = async (req: Request, res: Response) => {
  try {
    const products = await productService.getProductsBySub(req);
    res.status(200).send(products);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
  return productService.getProducts(req);
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
  return productService.getProducts(req);
};

const updateProduct = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Content can not empty" });
  }
  try {
    const result = await productService.updateProduct(req);
    const products = await productService.getProductById(req.params.id);
    res.status(200).json({
      success: result,
      message: "SubCategory updated successfully",
      data: products,
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

const deleteProduct = async (req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).send({ message: "Data to update can not empty" });
  }
  try {
    const result = await productService.deleteProduct(req);
    res
      .status(200)
      .json({ success: result, message: "Product deleted successfully" });
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

const topProducts = async (req: Request, res: Response) => {
  try {
    const result = await productService.topProducts();

    res.status(200).send(result);
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

const topSelling = async (req: Request, res: Response) => {
  try {
    const result = await productService.topSelling();

    res.status(200).send(result);
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
  createProduct,
  getProducts,
  getProductsBySub,
  getProductById,
  updateProduct,
  deleteProduct,
  topProducts,
  topSelling,
};
