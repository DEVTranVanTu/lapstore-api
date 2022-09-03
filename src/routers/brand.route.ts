import express from "express";
import brandController from "../controllers/brand.controller";
import auth from "../middlewares/auth.middlewares";

const router = express.Router();

router.route("/").post(brandController.createBrand);

router.route("/").get(brandController.getBrands);

router.route("/:id").get(brandController.getBrandById);

router.route("/:id").put(brandController.updateBrand);

router.route("/active/:id").put(brandController.unActiveBrand);

router.route("/:id").delete(brandController.deleteBrand);

export const BrandsRoute = router;
