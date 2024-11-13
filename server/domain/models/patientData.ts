import { PatientModel } from "@/server/domain/models/patientModel";

export type PatientData = Omit<PatientModel, "id">;
