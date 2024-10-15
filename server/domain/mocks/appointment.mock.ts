import { faker } from "@faker-js/faker";

export const mockAppointment = (startTime = faker.date.soon(), duration = 30) => {
  return {
    id: faker.string.uuid(),
    doctorId: faker.string.alphanumeric(12),
    patientId: faker.string.alphanumeric(12),
    startTime,
    duration,
  };
};
