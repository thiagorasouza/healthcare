"use server";

import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";

export const countPatients = async () => {
  const repository = new PatientsRepository();
  const result = await repository.count();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
