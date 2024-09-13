import { faker } from "@faker-js/faker";
import { addMinutes } from "date-fns";

export const mockAppointment = (duration = 30) => {
  const startTime = faker.date.soon();
  return {
    doctorId: faker.string.alphanumeric(12),
    patientId: faker.string.alphanumeric(12),
    startTime,
    endTime: addMinutes(startTime, duration),
  };
};
