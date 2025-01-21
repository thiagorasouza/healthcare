"use server";

import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";

export const getPatient = async (formData: FormData) => {
  const repository = new PatientsRepository();
  const result = await repository.getById(formData.get("id") as string);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
