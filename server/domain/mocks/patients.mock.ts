import { genders, identificationTypes } from "@/server/config/constants";
import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { faker } from "@faker-js/faker";

export const mockPatient = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.phone.number(),
  birthdate: faker.date.birthdate(),
  gender: faker.helpers.arrayElement(genders) as Gender,
  address: faker.location.streetAddress(),
  insuranceProvider: faker.company.name(),
  insuranceNumber: faker.string.alphanumeric(8),
  identificationType: faker.helpers.arrayElement(identificationTypes) as IdentificationType,
  identificationNumber: faker.string.alphanumeric(8),
  identificationId: faker.string.uuid(),
  usageConsent: faker.datatype.boolean(),
  privacyConsent: faker.datatype.boolean(),
  authId: faker.string.uuid(),
});
