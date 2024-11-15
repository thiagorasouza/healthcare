"use server";

import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { PatternsRepository } from "@/server/frameworks/appwrite/patternsRepository";
import { getSlotsValidator } from "@/server/frameworks/zod/getSlotsValidator";
import { GetSlotsController } from "@/server/useCases/getDoctorSlots/getSlotsController";
import { GetSlotsUseCase } from "@/server/useCases/getDoctorSlots/getSlotsUseCase";

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