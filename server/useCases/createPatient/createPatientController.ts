import { PatientData } from "@/server/domain/models/patientData";
import { CreatePatientUseCase } from "@/server/useCases/createPatient/createPatientUseCase";
import { GenericActionController } from "@/server/useCases/shared/GenericActionController";

export class CreatePatientController extends GenericActionController<
  PatientData,
  CreatePatientUseCase
> {}
