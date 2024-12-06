import { Success } from "@/server/useCases/shared/core/success";
import { DoctorModel } from "@/server/domain/models/doctorModel";

export class DoctorFoundSuccess extends Success<DoctorModel> {
  constructor(doctor: DoctorModel) {
    super(doctor);
  }
}
