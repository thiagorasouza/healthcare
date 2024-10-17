import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";

export const listAppointments = async () => {
  const repository = new AppointmentsRepository();
  return await repository.list();
};
