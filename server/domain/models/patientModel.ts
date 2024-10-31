export type Gender = "male" | "female" | "other";

export type IdentificationType = "passport" | "identityCard" | "driversLicense" | "other";

export interface PatientModel {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
  gender: Gender;
  address: string;
  insuranceProvider: string;
  insuranceNumber: string;
  identificationType: IdentificationType;
  identificationNumber: string;
  identificationId: string;
  usageConsent: boolean;
  privacyConsent: boolean;
  authId: string;
}

export type PatientData = Omit<PatientModel, "id">;
