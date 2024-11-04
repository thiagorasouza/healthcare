import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";

export const getDoctors = async () => {
  const repository = new DoctorsRepository();
  const result = await repository.list();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
