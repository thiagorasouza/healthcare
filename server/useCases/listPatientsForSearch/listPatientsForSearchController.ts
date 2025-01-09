import { ListPatientsForSearchUseCase } from "@/server/useCases/listPatientsForSearch/listPatientsForSearchUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class ListPatientsForSearchController extends GenericController<
  void,
  ListPatientsForSearchUseCase
> {}
