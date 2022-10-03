import { Request } from "express";
import inventoryModel from "../models/inventory.model";
import ProductModel from "../models/product.model";
import reviewModel, { IReview } from "../models/review.model";
import subcategoryModel from "../models/subcategory.model";

const createProduct = async (req: Request) => {
  const newProduct = new ProductModel({
    productName: req.body.productName,
    productThumbnail: req.body.productThumbnail,
    description: req.body.description,
    price: req.body.price,
    rating: req.body.rating,
    discount: req.body.discount,
    brand: req.body.brand,
    subCategory: req.body.subCategory,
    category: req.body.category,
    specs: req.body.specs,
  });
  return await newProduct.save();
};

const getProducts = async (req: Request) => {
  let products = null;
  let page: any = req.query.page;
  let limit: any = req.query.limit;
  let search: any = req.query.search;

  let searchInput: string;
  if (search && search.trim().length > 0) {
    searchInput = search;
  } else {
    searchInput = "";
  }

  if (page && limit) {
    const pages = parseInt(page);
    const limits = parseInt(limit);
    const skip = pages * limits - limits;
    const totals = await ProductModel.find({
      productName: { $regex: ".*" + searchInput + ".*", $options: "i" },
    })
      .countDocuments({})
      .then((total) => total);
    await ProductModel.find({
      productName: { $regex: ".*" + searchInput + ".*", $options: "i" },
    })
      .skip(skip)
      .limit(limits)
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "Products not found",
          };
        } else {
          products = {
            data: data,
            pagination: {
              totalRows: data.length,
              page: page,
              totals: totals,
              totalPages: Math.ceil(totals / limit),
            },
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
    await ProductModel.find()
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "Products not found",
          };
        } else {
          products = data;
        }
      })
      .catch((error) => {
        throw {
          status: error.status || 500,
          success: false,
          message: error.message,
        };
      });
  }
  return products;
};

const getProductsBySub = async (req: Request) => {
  let id = req.params.id;
  let page: any = req.query.page;
  let limit: any = req.query.limit;
  let products = null;
  const check = await subcategoryModel.findById({ _id: id });
  const query = {
    page: page,
    limit: limit,
  };
  if (query) {
    const pages = parseInt(page);
    const limits = parseInt(limit);
    const skip = pages * limits - limits;

    const totals = await ProductModel.countDocuments({
      subCategory: check._id,
    }).then((total) => total);
    await ProductModel.find({ subCategory: check._id })
      .skip(skip)
      .limit(limits)
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "Products not found",
          };
        } else {
          products = {
            data: data,
            pagination: {
              totalRows: data.length,
              page: page,
              totals: totals,
              totalPages: Math.ceil(totals / limit),
            },
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
    await ProductModel.find()
      .then((data) => {
        if (!data) {
          throw {
            status: 404,
            success: false,
            message: "Products not found",
          };
        } else {
          products = data.filter(function (e) {
            return e.subCategory.includes({ _id: id });
          });
        }
      })
      .catch((error) => {
        throw {
          status: error.status || 500,
          success: false,
          message: error.message,
        };
      });
  }
  return products;
};

const getProductById = async (id: string) => {
  let product = null;
  let reviews = null;
  let quantity = 0;
  await reviewModel
    .find({ product: id })
    .then((data) => {
      if (!data) {
        reviews = [];
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
  await inventoryModel
    .find({ productId: id })
    .then((data) => {
      if (!data) {
        quantity = 0;
      } else {
        quantity = data[0].quantity;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  await ProductModel.findById(id)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Product not found",
        };
      } else {
        const arrRating = reviews.map((element: IReview) => {
          return element.rating;
        });
        const rating = arrRating.reduce(
          (pre: number, cur: number) => pre + cur,
          0
        );

        const comment = reviews.filter(
          (review: IReview) => !!review.review
        ).length;
        const newData = JSON.parse(JSON.stringify(data));
        product = {
          ...newData,
          quantity: quantity,
          rating: Math.round(rating / reviews.length),
          comment: comment,
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

  return product;
};

const updateProduct = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  const data = req.body;
  await ProductModel.findByIdAndUpdate(id, data)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Product not found",
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

const deleteProduct = async (req: Request) => {
  let success = false;
  const id = req.params.id;
  await ProductModel.findByIdAndDelete(id, req.body)
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Product not found",
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

const topProduct = async () => {
  let products = null;
  let inventories = null;
  let topProducts = null;
  await inventoryModel
    .find()
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Inventory not found",
        };
      } else {
        inventories = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  await ProductModel.find()
    .then((data) => {
      if (!data) {
        throw {
          status: 404,
          success: false,
          message: "Product not found",
        };
      } else {
        products = data;
      }
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
};

export default {
  createProduct,
  getProducts,
  getProductsBySub,
  getProductById,
  updateProduct,
  deleteProduct,
};
