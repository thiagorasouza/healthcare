"use server";

import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";

export const countDoctors = async () => {
  const repository = new DoctorsRepository();
  return await repository.count();
};
