"use server";

import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";

export const getDoctor = async (formData: FormData) => {
  const repository = new DoctorsRepository();
  const result = await repository.getById(formData.get("id") as string);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
