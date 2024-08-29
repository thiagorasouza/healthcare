import { env } from "@/lib/env";

export function getFileLink(bucketId: string, fileId: string) {
  const projectId = env.projectId;
  return `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=${projectId}`;
}
