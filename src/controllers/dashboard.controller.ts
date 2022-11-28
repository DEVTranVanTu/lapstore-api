import { Request, Response } from "express";
import dashboardService from "../services/dashboard.service";

const getDashboardInfo = async (req: Request, res: Response) => {
  try {
    const dashboardInfo = await dashboardService.getDashboardInfo();
    res.status(200).send(dashboardInfo);
  } catch (error) {
    if (!error.status) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(error.status).json({ message: error.message });
    }
  }
};

export default {
  getDashboardInfo,
};
