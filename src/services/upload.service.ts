import { env } from "../configs/environments";
import { S3 } from "aws-sdk";
import fs from "fs";
const region = env.AWS_BUCKET_REGION;
const accessKeyId = env.AWS_ACCESS_KEY;
const secretAccessKey = env.AWS_SECRET_KEY;
const bucketName = env.AWS_BUCKET_NAME;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
const uploadFile = (file) => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
    ContentType: "image/png",
    Conditions: [
      ["content-length-range", 0, 1048576 * 20],
      ["starts-with", "$Content-Type", "image/"],
    ],
  };

  return s3.upload(uploadParams).promise();
};

// downloads a file from s3
const getFileStream = (fileKey) => {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
};
export default { uploadFile, getFileStream };
