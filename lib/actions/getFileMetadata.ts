import { storage } from "@/lib/appwrite/webClient";
import { success, unexpectedError } from "@/lib/results";

export async function getFileMetadata(bucketId: string, fileId: string) {
  try {
    // console.log("🚀 ~ bucketId:", bucketId);
    // console.log("🚀 ~ fileId:", fileId);
    const result = await storage.getFile(bucketId, fileId);
    return success(result);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
