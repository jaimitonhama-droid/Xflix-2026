"use server";

import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl as getAwsSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client, BUCKET_NAME, PUBLIC_URL } from "./r2";

type ImageFolder = "covers" | "avatars" | "banners" | "previews";

/**
 * Uploads an image to a specific folder in Cloudflare R2.
 */
export async function uploadImage(file: File, folder: ImageFolder): Promise<{ url?: string; path?: string; error?: string }> {
  try {
    if (!file.type.startsWith("image/")) {
      return { error: "Invalid file type. Only images are allowed." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.name.split(".").pop();
    const fileName = `${folder}/${uniqueSuffix}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    // If PUBLIC_URL is configured, return the full public path
    const url = PUBLIC_URL ? `${PUBLIC_URL}/${fileName}` : fileName;

    return { url, path: fileName };
  } catch (error: any) {
    console.error("Error uploading image to R2:", error);
    return { error: "Failed to upload image." };
  }
}

/**
 * Uploads a video file specifically to the videos folder.
 */
export async function uploadVideo(file: File): Promise<{ url?: string; path?: string; error?: string }> {
  try {
    if (!file.type.startsWith("video/")) {
      return { error: "Invalid file type. Only videos are allowed." };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.name.split(".").pop();
    const fileName = `videos/${uniqueSuffix}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    });

    await r2Client.send(command);

    const url = PUBLIC_URL ? `${PUBLIC_URL}/${fileName}` : fileName;
    
    return { url, path: fileName };
  } catch (error: any) {
    console.error("Error uploading video to R2:", error);
    return { error: "Failed to upload video." };
  }
}

/**
 * Deletes a file from Cloudflare R2 given its exact path.
 */
export async function deleteFile(path: string): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    await r2Client.send(command);
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting file from R2:", error);
    return { success: false, error: "Failed to delete file." };
  }
}

/**
 * Updates a file by deleting the old one and uploading a new one.
 */
export async function updateFile(oldPath: string, newFile: File, folder: ImageFolder | "videos"): Promise<{ url?: string; path?: string; error?: string }> {
  // First attempt to delete the old file (ignoring errors if it doesn't exist)
  if (oldPath) {
    await deleteFile(oldPath);
  }

  // Then upload the new one based on type
  if (folder === "videos") {
    return uploadVideo(newFile);
  } else {
    return uploadImage(newFile, folder);
  }
}

/**
 * Generates a temporary secure Signed URL for accessing private content.
 */
export async function getSignedUrl(path: string, expiresInMinutes: number = 60): Promise<{ url?: string; error?: string }> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: path,
    });

    const url = await getAwsSignedUrl(r2Client, command, { expiresIn: expiresInMinutes * 60 });
    return { url };
  } catch (error: any) {
    console.error("Error generating signed URL:", error);
    return { error: "Failed to generate signed URL." };
  }
}
