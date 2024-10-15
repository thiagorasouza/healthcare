export interface AppointmentModel {
  id?: string;
  doctorId: string;
  patientId: string;
  startTime: Date;
  duration: number;
}
