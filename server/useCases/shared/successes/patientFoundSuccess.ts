import { Success } from "@/server/useCases/shared/core/success";
import { PatientModel } from "@/server/domain/models/patientModel";

export class PatientFoundSuccess extends Success<PatientModel> {
  constructor(patient: PatientModel) {
    super(patient);
  }
}
