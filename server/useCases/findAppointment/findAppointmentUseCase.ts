import { Success } from "@/server/useCases/shared/core/success";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
} from "@/server/repositories";
import { NotFoundFailure, ServerFailure } from "@/server/useCases/shared/failures";
import { UseCase } from "@/server/useCases/shared/core/useCase";
import { isSameDay } from "date-fns";
import { AppointmentPublicData } from "@/lib/actions/localStorage";
import { getHoursStr } from "@/server/useCases/shared/helpers/date";

// algorithm
// - search patient by email
// - check if birthdate matches patient
// - look for appointments using patient id

export interface FindAppointmentRequest {
  email: string;
  birthdate: Date;
}

export class FindAppointmentUseCase implements UseCase {
  public constructor(
    private readonly patientsRepository: PatientsRepositoryInterface,
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
  ) {}

  public async execute(
    request: FindAppointmentRequest,
  ): Promise<Success<AppointmentPublicData[]> | NotFoundFailure | ServerFailure> {
    const { email, birthdate } = request;

    const notFoundFailure = new NotFoundFailure("");

    const patientResult = await this.patientsRepository.getByEmail(email);

    if (!patientResult.ok) {
      return patientResult;
    }

    const patient = patientResult.value;
    if (!patient || !isSameDay(patient.birthdate, birthdate)) {
      return notFoundFailure;
    }

    const appointmentsResult = await this.appointmentsRepository.getByPatientId(patient.id);
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

    const publicAppointmentData: AppointmentPublicData[] = appointments.map((ap) => {
      const doctor = doctors.find((doctor) => doctor.id === ap.doctorId)!;
      return {
        id: ap.id!,
        doctor: {
          name: doctor.name,
          specialty: doctor.specialty,
          pictureId: doctor.pictureId,
        },
        patient: {
          name: patient.name,
        },
        date: ap.startTime.toISOString(),
        hour: getHoursStr(ap.startTime),
        duration: ap.duration,
      };
    });

    return new Success(publicAppointmentData);
  }
}
