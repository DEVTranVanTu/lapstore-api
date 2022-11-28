import express from "express";
import dashboardController from "../controllers/dashboard.controller";

const router = express.Router();

router.route("/").get(dashboardController.getDashboardInfo);

export const dashboardRouter = router;
