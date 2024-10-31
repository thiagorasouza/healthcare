import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";

export const getDoctors = async () => {
  const repository = new DoctorsRepository();
  return await repository.list();
};
