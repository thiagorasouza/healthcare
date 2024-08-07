import { env } from "@/lib/env";

export function getImageLink(imageId: string) {
  const projectId = env.projectId;
  const bucketId = env.imageBucketId;
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}`;
}
