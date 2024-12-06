"use server";

import { StorageRepository } from "@/server/adapters/appwrite/storageRepository";

export const getFile = async (formData: FormData) => {
  const repository = new StorageRepository();
  const result = await repository.get(formData.get("id") as string);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
