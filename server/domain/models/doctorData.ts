import { DoctorModel } from "@/server/domain/models/doctorModel";

export type DoctorData = Omit<DoctorModel, "id">;
