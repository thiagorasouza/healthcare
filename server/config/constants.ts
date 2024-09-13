import { Gender, IdentificationType } from "@/server/domain/models/patientModel";
import { Weekday } from "@/server/domain/models/patternModel";

export const genders: Gender[] = ["male", "female", "other"];
export const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const identificationTypes: IdentificationType[] = [
  "passport",
  "identityCard",
  "driversLicense",
  "other",
];

// Minimum appointment duration in minutes
export const MIN_DURATION = 15;

// Minimum booking advance duration in minutes
export const MIN_ADVANCE = 60;
