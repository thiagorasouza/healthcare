import { storage } from "@/lib/appwrite/adminClient";
import { success, unexpectedError } from "@/lib/results";

export async function getFileMetadataServer(bucketId: string, fileId: string) {
  try {
    const result = await storage.getFile(bucketId, fileId);
    return success(result);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
