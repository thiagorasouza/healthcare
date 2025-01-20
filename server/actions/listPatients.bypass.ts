"use server";

import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";

export const listPatients = async () => {
  const repository = new PatientsRepository();
  const result = await repository.list();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
