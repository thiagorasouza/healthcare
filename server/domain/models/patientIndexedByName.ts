import { PatientModel } from "@/server/domain/models/patientModel";

export type PatientNamePhone = Pick<PatientModel, "id" | "name" | "phone">;
export type PatientsIndexedByName = Record<string, PatientNamePhone>;
