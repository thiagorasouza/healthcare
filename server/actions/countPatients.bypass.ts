"use server";

import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";

export const countPatients = async () => {
  const repository = new PatientsRepository();
  return await repository.count();
};
