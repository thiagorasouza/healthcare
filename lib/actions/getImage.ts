"use client";

import { ImageFormat, storage } from "@/lib/appwrite/webClient";
import { success, unexpectedError } from "@/lib/results";

export async function getImage(imageId: string) {
  try {
    const imageUrl = await storage.getFilePreview(
      process.env.NEXT_PUBLIC_IMAGES_BUCKET_ID!,
      imageId,
      256, // width (optional)
      256, // height (optional)
      undefined, // gravity (optional)
      undefined, // quality (optional)
      undefined, // borderWidth (optional)
      undefined, // borderColor (optional)
      undefined, // borderRadius (optional)
      undefined, // opacity (optional)
      undefined, // rotation (optional)
      undefined, // background (optional)
      ImageFormat.Jpg, // output (optional)
    );

    return success(imageUrl);
  } catch (error) {
    console.log(error);
    return unexpectedError();
  }
}
