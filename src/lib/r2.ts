import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

const accountId = process.env.R2_ENDPOINT?.split("//")[1]?.split(".")[0];
const r2Endpoint = process.env.R2_ENDPOINT;

// Si les variables ne sont pas définies (ex: build time), on crée un client factice
export const s3Client = new S3Client({
  region: "auto",
  endpoint: r2Endpoint || "https://dummy.r2.cloudflarestorage.com",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "dummy",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "dummy",
  },
})

/**
 * Upload an image buffer to Cloudflare R2
 * @param fileBuffer The file content as a Buffer
 * @param fileName The unique file name (e.g. '1234-image.jpg')
 * @param contentType The MIME type (e.g. 'image/jpeg')
 * @returns The public URL of the uploaded image
 */
export async function uploadImageToR2(
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
): Promise<string> {
  const bucketName = process.env.R2_BUCKET_NAME
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "") // Remove trailing slash

  if (!bucketName || !publicUrl) {
    throw new Error("Cloudflare R2 env vars are missing. Please check R2_BUCKET_NAME and R2_PUBLIC_URL.")
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  })

  await s3Client.send(command)

  return `${publicUrl}/${fileName}`
}

/**
 * Delete an image from Cloudflare R2
 * @param fileUrl The full public URL or just the file key
 */
export async function deleteImageFromR2(fileUrl: string): Promise<void> {
  const bucketName = process.env.R2_BUCKET_NAME
  if (!bucketName) throw new Error("Missing R2_BUCKET_NAME")

  // Extract the key from the URL if a full URL was passed
  const publicUrl = process.env.R2_PUBLIC_URL?.replace(/\/+$/, "") || ""
  let key = fileUrl
  if (fileUrl.startsWith(publicUrl)) {
    key = fileUrl.replace(`${publicUrl}/`, "")
  }

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: key,
  })

  await s3Client.send(command)
}
