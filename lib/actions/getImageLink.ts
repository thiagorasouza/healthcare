import { getFileLink } from "@/lib/actions/getFileLink";
import { env } from "@/lib/env";

export function getImageLink(imageId: string) {
  return getFileLink(env.imagesBucketId, imageId);
}
