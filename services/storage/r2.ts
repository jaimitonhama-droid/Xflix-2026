import { S3Client } from "@aws-sdk/client-s3";

// Ensure environment variables are loaded securely (server-side only)
const accountId = process.env.R2_ACCOUNT_ID || "";
const accessKeyId = process.env.R2_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || "";

export const BUCKET_NAME = process.env.R2_BUCKET_NAME || "";
export const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

// Initialize S3 Client configured for Cloudflare R2
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});
