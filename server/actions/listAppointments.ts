"use server";

import { listAppointmentsFactory } from "@/server/factories/listAppointments.factory";

export const listAppointments = async () => {
  const useCase = listAppointmentsFactory();
  const result = await useCase.execute();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
