import express from "express";
import inventoryController from "../controllers/inventory.controller";

const router = express.Router();

router.route("/").post(inventoryController.addInventory);

router.route("/").get(inventoryController.getListInventory);

router.route("/:id").get(inventoryController.getInventoryById);

router.route("/brand/:id").get(inventoryController.getInventoryByBrand);

router.route("/:id").put(inventoryController.updateInventory);

router.route("/:id").delete(inventoryController.deleteInventory);

export const InventoryRoute = router;
