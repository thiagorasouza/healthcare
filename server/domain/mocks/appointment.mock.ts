import { faker } from "@faker-js/faker";

export const mockAppointment = (startTime = faker.date.soon(), duration = 30) => {
  return {
    doctorId: faker.string.alphanumeric(12),
    patientId: faker.string.alphanumeric(12),
    startTime,
    duration,
  };
};
