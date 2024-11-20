import { Success } from "@/server/core/success";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  AppointmentsRepositoryInterface,
  DoctorsRepositoryInterface,
  PatientsRepositoryInterface,
} from "@/server/repositories";
import { EmailsRepositoryInterface } from "@/server/repositories/emailsRepository";
import { ServerFailure } from "@/server/shared/failures";
import { UseCase } from "@/server/shared/protocols/useCase";
import { ListAppointmentsUseCase } from "@/server/useCases/listAppointments/listAppointmentsUseCase";
import { makeConfirmationEmail } from "@/server/useCases/sendConfirmation/makeConfirmationEmail";
import { format } from "date-fns";

export interface SendConfirmationRequest {
  email: string;
  appointmentId: string;
}

export class SendConfirmationUseCase implements UseCase {
  public constructor(
    private readonly emailsRepository: EmailsRepositoryInterface,
    private readonly appointmentsRepository: AppointmentsRepositoryInterface,
    private readonly doctorsRepository: DoctorsRepositoryInterface,
    private readonly patientsRepository: PatientsRepositoryInterface,
  ) {}

  public async execute(request: SendConfirmationRequest): Promise<Success<string> | ServerFailure> {
    const { email, appointmentId } = request;

    const appointmentResult = await this.appointmentsRepository.getById(appointmentId);
    if (!appointmentResult.ok) {
      return appointmentResult;
    }

    const { id, startTime, duration, patientId, doctorId } = appointmentResult.value;

    const doctorResult = await this.doctorsRepository.getById(doctorId);
    if (!doctorResult.ok) {
      return doctorResult;
    }

    const doctor = doctorResult.value;

    const patientResult = await this.patientsRepository.getById(patientId);
    if (!patientResult.ok) {
      return patientResult;
    }

    const patient = patientResult.value;

    const hydratedAppointment: AppointmentHydrated = {
      id,
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
      startTime: startTime,
      duration: duration,
    };

    const subject = `Mednow - Appointment with Dr. ${doctor.name} at ${format(startTime, "PPP")}`;
    const body = makeConfirmationEmail(hydratedAppointment);

    const sendResult = await this.emailsRepository.send(email, subject, body);
    return sendResult;
  }
}