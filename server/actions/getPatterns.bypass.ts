"use server";

import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";

export const getPatterns = async (formData: FormData) => {
  const repository = new PatternsRepository();
  const result = await repository.listByDoctorId(formData.get("id") as string);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
