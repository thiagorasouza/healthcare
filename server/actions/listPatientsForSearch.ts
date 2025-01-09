"use server";

import { PatientsRepository } from "@/server/adapters/appwrite/patientsRepository";
import { ListPatientsForSearchController } from "@/server/useCases/listPatientsForSearch/listPatientsForSearchController";
import { ListPatientsForSearchUseCase } from "@/server/useCases/listPatientsForSearch/listPatientsForSearchUseCase";

export const listPatientsForSearch = async () => {
  const repository = new PatientsRepository();
  const useCase = new ListPatientsForSearchUseCase(repository);
  const controller = new ListPatientsForSearchController(useCase);
  const result = await controller.handle();
  const plainObject = Object.assign({}, result);
  return plainObject;
};
