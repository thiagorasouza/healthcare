"use client";

export function getImageLink(imageId: string) {
  const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!;
  const bucketId = process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID!;
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
}
