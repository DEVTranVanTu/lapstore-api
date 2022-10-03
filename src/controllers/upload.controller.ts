import { Request, Response } from "express";
import { env } from "../configs/environments";

import uploadService from "../services/upload.service";

import fs from "fs";
import util from "util";
const unlinkFile = util.promisify(fs.unlink);

interface MulterRequest extends Request {
  file: any;
}

const getFile = (req: Request, res: Response) => {
  const key = req.params.key;
  const readStream = uploadService.getFileStream(key);

  readStream.pipe(res);
};

const uploadFile = async (req: Request, res: Response) => {
  const file = (req as MulterRequest).file;
  const result = await uploadService.uploadFile(file);
  await unlinkFile(file.path);
  res.send({
    imagePath: `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_BUCKET_REGION}.amazonaws.com/${result.Key}`,
  });
};

export default { getFile, uploadFile };
