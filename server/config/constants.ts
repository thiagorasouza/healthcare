import { Gender, IdentificationType } from "@/server/domain/models/patientModel";

export const genders: Gender[] = ["male", "female", "other"];
export const identificationTypes: IdentificationType[] = [
  "passport",
  "identityCard",
  "driversLicense",
  "other",
];
