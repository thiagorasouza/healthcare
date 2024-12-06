import { PatientData } from "@/server/domain/models/patientData";
import { CreatePatientUseCase } from "@/server/useCases/createPatient/createPatientUseCase";
import { GenericController } from "@/server/useCases/shared/generics/GenericController";

export class CreatePatientController extends GenericController<PatientData, CreatePatientUseCase> {}
