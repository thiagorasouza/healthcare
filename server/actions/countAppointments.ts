"use server";

import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";

export const countAppointments = async () => {
  const repository = new AppointmentsRepository();
  return await repository.count();
};
