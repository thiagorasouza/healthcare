"use server";

import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";

export const countDoctors = async () => {
  const doctorsRepository = new DoctorsRepository();
  return await doctorsRepository.count();
};
