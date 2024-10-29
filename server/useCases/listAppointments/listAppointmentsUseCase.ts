import { Success } from "@/server/core/success";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { AppointmentsRepository } from "@/server/frameworks/appwrite/appointmentsRepository";
import { DoctorsRepository } from "@/server/frameworks/appwrite/doctorsRepository";
import { PatientsRepository } from "@/server/frameworks/appwrite/patientsRepository";
import { ServerFailure } from "@/server/shared/failures";
import { UseCase } from "@/server/shared/protocols/useCase";

export class ListAppointmentsUseCase implements UseCase {
  public constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
    private readonly doctorsRepository: DoctorsRepository,
    private readonly patientsRepository: PatientsRepository,
  ) {}

  public async execute(): Promise<Success<AppointmentHydrated[]> | ServerFailure> {
    try {
      const appointmentsResult = await this.appointmentsRepository.list();
      if (!appointmentsResult.ok) {
        return appointmentsResult;
      }
      const appointments = appointmentsResult.value;

      if (appointments.length === 0) {
        return new Success([]);
      }

      const doctorIds = new Set<string>();
      const patientsIds = new Set<string>();
      appointments.forEach((ap) => {
        doctorIds.add(ap.doctorId);
        patientsIds.add(ap.patientId);
      });

      const doctorsResult = await this.doctorsRepository.list("$id", [...doctorIds]);
      if (!doctorsResult.ok) {
        return doctorsResult;
      }
      const doctors = doctorsResult.value;

      const patientsResults = await this.patientsRepository.list("$id", [...patientsIds]);
      if (!patientsResults.ok) {
        return patientsResults;
      }
      const patients = patientsResults.value;

      const hydratedAppointments: AppointmentHydrated[] = appointments.map((ap) => {
        const doctor = doctors.find((doctor) => doctor.id === ap.doctorId)!;
        const patient = patients.find((patient) => patient.id === ap.patientId)!;
        return {
          id: ap.id!,
          doctor: {
            name: doctor.name,
            specialty: doctor.specialty,
            pictureId: doctor.pictureId,
          },
          patient: {
            name: patient.name,
            email: patient.email,
            phone: patient.phone,
            insuranceProvider: patient.insuranceProvider,
          },
          startTime: ap.startTime,
          duration: ap.duration,
        };
      });

      return new Success(hydratedAppointments);
    } catch (error) {
      return new ServerFailure(error);
    }
  }
}
