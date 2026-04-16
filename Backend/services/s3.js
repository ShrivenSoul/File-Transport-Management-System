import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import "dotenv/config";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});


export async function uploadToS3(filePath, fileName) {
  const fileStream = fs.createReadStream(filePath);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
    Body: fileStream,
  });

  await s3.send(command);

  return `https://${process.env.S3_BUCKET}.s3.amazonaws.com/${fileName}`;
}
export async function getDownloadUrl(fileName) {
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileName,
  });
  const url = await getSignedUrl(s3, command, {
    expiresIn: 60, // 1 minute
  });

  return url;
}
export async function getFileList() {
  const command = new ListObjectsV2Command({
    Bucket: process.env.S3_BUCKET
  });
  const resp = await s3.send(command);

  return resp;
}