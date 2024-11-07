import { genders, identificationTypes } from "@/server/config/constants";
import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { faker } from "@faker-js/faker";
import { set } from "date-fns";

export const mockPatient = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  phone: faker.helpers.fromRegExp("+3519[0-9]{8}"),
  birthdate: set(faker.date.birthdate(), { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }),
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
