import { genders, identificationTypes } from "@/server/config/constants";
import { PatientData } from "@/server/domain/models/patientData";
import { Gender, IdentificationType, PatientModel } from "@/server/domain/models/patientModel";
import { ServerFailure } from "@/server/useCases/shared/failures";
import { faker } from "@faker-js/faker";
import { set } from "date-fns";

export const mockPatientModel = (): PatientModel => ({
  ...mockPatientDataWithoutIdentification(),
  id: faker.string.uuid(),
  identificationId: faker.string.uuid(),
});

export const mockPatientDataWithoutIdentification = (): Omit<PatientData, "identification"> => ({
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
  usageConsent: true,
  privacyConsent: true,
});

export const mockPatientData = async (): Promise<PatientData> => {
  try {
    const response = await fetch("/pdf/test_pdf.pdf");
    const blob = await response.blob();

    return {
      ...mockPatientDataWithoutIdentification(),
      identification: new File([blob], "test_pdf.pdf", { type: "application/pdf" }),
    };
  } catch (error) {
    throw new ServerFailure("Unable to mock identification file.");
  }
};
