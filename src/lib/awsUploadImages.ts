import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

function base64ToBuffer(base64: string) {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 string");

  const contentType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, "base64");
  return { buffer, contentType };
}

export async function uploadBase64Image(base64: string, path: string) {
  const { buffer, contentType } = base64ToBuffer(base64);

  const bucket = process.env.BUCKET_NAME || process.env.Bucket_Name;

  if (!bucket) {
    throw new Error("BUCKET_NAME (or Bucket_Name) env var is not set");
  }

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: path,
    Body: buffer,
    ContentType: contentType,
  });

  await s3.send(command);

  return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`;
}

export async function deleteS3Object(key: string) {
  const bucket = process.env.BUCKET_NAME || process.env.Bucket_Name;

  if (!bucket) {
    throw new Error("BUCKET_NAME (or Bucket_Name) env var is not set");
  }

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await s3.send(command);
  return true;
}
