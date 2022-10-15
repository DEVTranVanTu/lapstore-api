import { Request, Response } from "express";
import userModel from "../models/user.model";
import notificationService from "../services/notification.service";

const getNotificationByUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await userModel.findById(id);
    if (user) {
      const notification = await notificationService.getNotificationByUser(req);
      res.status(200).json({
        success: true,
        message: "Get notification successfully!",
        data: notification,
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

const deleteOneNotification = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (id) {
      await notificationService.deleteOneNotification(req);
      res.status(200).json({
        success: true,
        message: "Delete notification successfully!",
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
  getNotificationByUser,
  deleteOneNotification,
};
