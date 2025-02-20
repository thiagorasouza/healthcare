"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";

export const countAppointments = async () => {
  const repository = new AppointmentsRepository();
  const result = await repository.count();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
