import { CountDoctorsUseCase } from "@/server/useCases/countDoctors/countDoctorsUseCase";
import { GenericActionControllerNoData } from "@/server/useCases/shared/GenericActionControllerNoData";

export class CountDoctorsController extends GenericActionControllerNoData<CountDoctorsUseCase> {}
