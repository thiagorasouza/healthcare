"use server";

import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";

export const countDoctors = async () => {
  const repository = new DoctorsRepository();
  const result = await repository.count();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
