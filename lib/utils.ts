import { type AppwriteException as NodeAppwriteException } from "node-appwrite";
import { type AppwriteException as WebAppwriteException } from "appwrite";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SafeParseError, ZodError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function objectToFormData(obj: object) {
  const formData = new FormData();
  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }
    // @ts-ignore
    formData.append(property, obj[property]);
  }

  return formData;
}

export function getInvalidFieldsList<Input>(
  validationError: SafeParseError<Input>,
): string[] {
  const fieldErrors = validationError.error?.flatten().fieldErrors;
  return fieldErrors ? Object.keys(fieldErrors) : [];
}

export function semanticJoin(list: string[]) {
  const listCopy = [...list];
  let last = "";
  if (listCopy.length > 1) {
    last = ` and ${listCopy.pop()}`;
  }
  return listCopy.join(", ") + last;
}

export function generateRandomPassword(pwdLength: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  const charactersLength = characters.length;

  for (let i = 0; i < pwdLength; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    password += characters.charAt(randomIndex);
  }

  return password;
}

export function getRandomDoctorSpecialty(): string {
  const specialties: string[] = [
    "Cardiology",
    "Dermatology",
    "Emergency Medicine",
    "Endocrinology",
    "Family Medicine",
    "Gastroenterology",
    "Geriatrics",
    "Hematology",
    "Infectious Disease",
    "Nephrology",
    "Neurology",
    "Obstetrics and Gynecology",
    "Oncology",
    "Ophthalmology",
    "Orthopedics",
    "Otolaryngology",
    "Pediatrics",
    "Psychiatry",
    "Pulmonology",
    "Radiology",
    "Rheumatology",
    "Surgery",
    "Urology",
  ];

  const randomIndex = Math.floor(Math.random() * specialties.length);
  return specialties[randomIndex];
}

export type AppwriteException = NodeAppwriteException | WebAppwriteException;

export function isAppwriteException(error: any): error is AppwriteException {
  return (
    typeof error === "object" &&
    error !== null &&
    error.constructor.name === "AppwriteException"
  );
}

export function isZodException(error: any): error is ZodError {
  return (
    typeof error === "object" &&
    error !== null &&
    error.constructor.name === "ZodError"
  );
}

export function abbreviateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }

  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(" ");

  if (lastSpaceIndex > -1) {
    return text.substring(0, lastSpaceIndex) + " (...)";
  }

  return truncated + " (...)";
}

export function getRandomPictureURL() {
  const gendersList = ["men", "women"];
  const gender = gendersList[Math.floor(Math.random() * gendersList.length)];
  const number = Math.floor(Math.random() * 91);
  return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
}
