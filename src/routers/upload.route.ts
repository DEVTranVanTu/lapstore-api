import multer from "multer";
import express from "express";
import uploadController from "../controllers/upload.controller";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router
  .route("/images")
  .post(upload.single("image"), uploadController.uploadFile);

export const UploadRouter = router;
