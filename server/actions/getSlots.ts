"use server";

import { AppointmentsRepository } from "@/server/adapters/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/adapters/appwrite/doctorsRepository";
import { PatternsRepository } from "@/server/adapters/appwrite/patternsRepository";
import { getSlotsValidator } from "@/server/adapters/zod/getSlotsValidator";
import { GetSlotsController } from "@/server/useCases/getSlots/getSlotsController";
import { GetSlotsUseCase } from "@/server/useCases/getSlots/getSlotsUseCase";

export const getSlots = async (formData: FormData) => {
  const doctorsRepository = new DoctorsRepository();
  const patternsRepository = new PatternsRepository();
  const appointmentsRepository = new AppointmentsRepository();
  const useCase = new GetSlotsUseCase(
    doctorsRepository,
    patternsRepository,
    appointmentsRepository,
  );
  const controller = new GetSlotsController(useCase, getSlotsValidator);

  const result = await controller.handle(formData);
  const plainObject = Object.assign({}, result);
  return plainObject;
};
