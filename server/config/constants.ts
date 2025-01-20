import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { Weekday } from "@/server/domain/models/patternModel";

export const genders: Gender[] = ["male", "female", "other"];
export const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

// Id field related
export const identificationTypes: IdentificationType[] = [
  "passport",
  "identityCard",
  "driversLicense",
  "other",
];
export const idLabels = {
  identityCard: "Identity Card",
  driversLicense: "Driver's License",
  passport: "Passport",
  other: "Other",
};
export const allowedFileTypes = ["application/pdf"];
export const allowedFileTypesTextual = ["PDF"];
export const maxFileSize = 5 * 1024 * 1024; // 5 MB

export const allowedImageTypes = ["image/png", "image/jpeg", "image/gif"];
export const maxImageSize = 5 * 1024 * 1024; // 5 MB
export const currentPictureName = "___current___.jpg";

// Minimum appointment duration in minutes
export const MIN_DURATION = 15;
export const DURATION_UNIT = "minutes";

// Minimum booking advance duration in minutes
export const MIN_ADVANCE = 60;
export const ADVANCE_UNIT = "minutes";
