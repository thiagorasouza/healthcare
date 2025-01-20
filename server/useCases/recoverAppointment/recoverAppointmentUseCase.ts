import { Success } from "@/server/useCases/shared/core/success";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
} from "@/server/repositories";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { isSameDay } from "date-fns";

// algorithm
// - search patient by email
// - check if birthdate matches patient
// - look for appointments using patient id

export interface RecoverAppointmentRequest {
  email: string;
  birthdate: Date;
}

export class RecoverAppointmentUseCase implements UseCase {
  public constructor(
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
  ) {}

  public async execute(
    request: RecoverAppointmentRequest,
  ): Promise<Success<AppointmentHydrated[]> | NotFoundFailure | ServerFailure> {
    const { email, birthdate } = request;

    const notFoundFailure = new NotFoundFailure("");

    const patientResult = await this.patientsRepository.getByEmail(email);

    if (!patientResult.ok) {
      return patientResult;
    }

    const patient = patientResult.value;
    // console.log("🚀 ~ patient:", patient);
    // console.log("🚀 ~ birthdate:", birthdate);
    // console.log("comparison:", isSameDay(patient.birthdate, birthdate));
    if (!patient || !isSameDay(patient.birthdate, birthdate)) {
      return notFoundFailure;
    }

    const appointmentsResult = await this.appointmentsRepository.getByPatientId(patient.id);
    // console.log("🚀 ~ appointmentsResult:", appointmentsResult);
    if (!appointmentsResult.ok) {
      return appointmentsResult;
    }

    const appointments = appointmentsResult.value;
    if (appointments.length === 0) {
      return notFoundFailure;
    }

    const doctorIds = new Set<string>();
    appointments.forEach((ap) => doctorIds.add(ap.doctorId));

    const doctorsResult = await this.doctorsRepository.listByIds([...doctorIds]);
    if (!doctorsResult.ok) {
      return doctorsResult;
    }
    const doctors = doctorsResult.value;

    const hydratedAppointments: AppointmentHydrated[] = appointments.map((ap) => {
      const doctor = doctors.find((doctor) => doctor.id === ap.doctorId)!;
      return {
        id: ap.id!,
        doctor,
        patient,
        startTime: ap.startTime,
        duration: ap.duration,
      };
    });
    // console.log("🚀 ~ hydratedAppointments:", hydratedAppointments);

    return new Success(hydratedAppointments);
  }
}
