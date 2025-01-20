import { GenericController } from "@/server/useCases/shared/generics/GenericController";
import {
  UpdateDoctorRequest,
  UpdateDoctorUseCase,
} from "@/server/useCases/updateDoctor/updateDoctorUseCase";

export class UpdateDoctorController extends GenericController<
  UpdateDoctorRequest,
  UpdateDoctorUseCase
> {}
