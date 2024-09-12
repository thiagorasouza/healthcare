export interface PatientModel {
  name: string;
  email: string;
  phone: string;
  birthdate: Date;
  gender: "male" | "female" | "other";
  address: string;
  insuranceProvider: string;
  insuranceNumber: string;
  identificationType: "passport" | "identityCard" | "driversLicense" | "other";
  identificationNumber: string;
  identificationId: string;
  usageConsent: boolean;
  privacyConsent: boolean;
  authId: string;
}
