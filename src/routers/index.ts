import express, { Request, Response } from "express";
import { HttpStatusCode } from "../utils/constants";
import { BrandsRoute } from "./brand.route";
import { CartRoute } from "./cart.route";
import { CategoriesRoute } from "./category.route";
import { InventoryRoute } from "./inventory.route";
import { NotificationRoute } from "./notification.route";
import { OrderRoute } from "./order.route";
import { ProductRoute } from "./product.route";
import { ReviewRouter } from "./review.route";
import { SubCategoriesRoute } from "./subcategory.route";
import { UploadRouter } from "./upload.route";
import { userRouter } from "./user.route";

const router = express.Router();

/**Get status */
router.get("/status", (req: Request, res: Response) => {
  res.status(HttpStatusCode.OK).json({ status: "OK!" });
});

/**Auth APIs */
router.use("/auth", userRouter);

/**Category */
router.use("/category", CategoriesRoute);

/**Sub Category */
router.use("/subcategory", SubCategoriesRoute);

/**Brands APIs */
router.use("/brands", BrandsRoute);

/**Product APIs */
router.use("/products", ProductRoute);

/**Inventory APIs */
router.use("/inventory", InventoryRoute);

/**Cart APIs */
router.use("/cart", CartRoute);

/**Order APIs */
router.use("/order", OrderRoute);

/**Review APIs */
router.use("/review", ReviewRouter);

/**Notification APIs */
router.use("/notification", NotificationRoute);

/**Upload APIs */
router.use("/upload", UploadRouter);

export const api = router;
