import { DoctorData } from "@/server/domain/models/doctorData";
import { CreateDoctorUseCase } from "@/server/useCases/createDoctor/createDoctorUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class CreateDoctorController extends GenericController<DoctorData, CreateDoctorUseCase> {}
