import { Success } from "@/server/useCases/shared/core/success";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { Slots } from "@/server/domain/slots";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatternsRepositoryInterface,
} from "@/server/repositories";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { addMonths } from "date-fns";

// algorithm
// - get all patterns for this doctorId
// - parse slots up to 3 months upfron
// - remove already booked slots

export interface GetSlotsRequest {
  doctorId: string;
  startDate: Date;
}

export class GetSlotsUseCase implements UseCase {
  public constructor(
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly patternsRepository: PatternsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
  ) {}

  public async execute(request: GetSlotsRequest): Promise<Success<SlotsModel> | ServerFailure> {
    try {
      const { doctorId, startDate } = request;
      // console.log("🚀 ~ GetSlotsUseCase ~ execute ~ startDate:", startDate)

      const patternsResult = await this.patternsRepository.listByDoctorId(doctorId);
      // console.log("🚀 ~ GetSlotsUseCase ~ execute ~ patternsResult:", patternsResult)
      if (!patternsResult.ok) {
        return new Success(new Map());
      }

      const endDate = addMonths(startDate, 3);

      const slots = new Slots()
        .source(patternsResult.value)
        .start(startDate)
        .end(endDate)
        .parse()
        .sort();

      const appointmentsResult = await this.appointmentsRepository.getByDoctorId(doctorId);
      if (!appointmentsResult.ok) {
        return appointmentsResult;
      }

      const storedAppointments = appointmentsResult.value;
      storedAppointments.forEach((ap) => slots.remove(ap.startTime));

      return new Success(slots.get());
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
