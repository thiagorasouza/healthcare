"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";

export const deleteAppointment = async (formData: FormData) => {
  const repository = new AppointmentsRepository();
  const result = await repository.delete(formData.get("id") as string);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
