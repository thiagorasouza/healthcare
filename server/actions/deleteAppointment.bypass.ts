"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";

export const deleteAppointment = async (formData: FormData) => {
  // throw new Error();
  const repository = new AppointmentsRepository();
  const result = await repository.delete(formData.get("id") as string);
  // console.log("🚀 ~ result:", result);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
