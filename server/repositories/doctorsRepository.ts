import { DoctorModel } from "@/server/domain/models/doctorModel";
import { RepositoryInterface } from "@/server/repositories/repository";

export interface DoctorsRepositoryInterface extends RepositoryInterface<DoctorModel> {}
