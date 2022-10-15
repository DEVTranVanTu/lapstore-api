import { Request } from "express";
import notificationModel from "../models/notification.model";

const addNotification = async ({
  userId,
  message,
  image,
  status,
  typeOfNotification,
  idToReview,
}) => {
  const notification = new notificationModel({
    userId: userId,
    message: message,
    image: image,
    status: status,
    typeOfNotification: typeOfNotification,
    idToReview: idToReview,
  });
  await notification.save();
};

const getNotificationByUser = async (req: Request) => {
  const userId = req.params.id;
  let notification = null;
  await notificationModel
    .find({ userId: userId })
    .then((data) => {
      notification = data;
    })
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
  return notification;
};

const deleteOneNotification = async (req: Request) => {
  const id = req.params.id;
  await notificationModel
    .findByIdAndDelete(id)
    .then((data) => data)
    .catch((error) => {
      throw {
        status: error.status || 500,
        success: false,
        message: error.message,
      };
    });
};

export default {
  addNotification,
  getNotificationByUser,
  deleteOneNotification,
};
