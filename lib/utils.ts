import { type AppwriteException as NodeAppwriteException } from "node-appwrite";
import { type AppwriteException as WebAppwriteException } from "appwrite";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SafeParseError, ZodError } from "zod";
import { Day, differenceInMinutes, getHours, getMinutes, nextDay, parse, subDays } from "date-fns";
import { Weekday } from "@/server/domain/models/patternModel";
import { weekdays } from "@/server/config/constants";

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
    const value = obj[property];
    formData.append(property, value instanceof Date ? value.toISOString() : value);
  }

  return formData;
}

export function getInvalidFieldsList<Input>(validationError: SafeParseError<Input>): string[] {
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
    typeof error === "object" && error !== null && error.constructor.name === "AppwriteException"
  );
}

export function isZodException(error: any): error is ZodError {
  return typeof error === "object" && error !== null && error.constructor.name === "ZodError";
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

export function setDateWithOriginalTime(originalDate: Date, newDate: Date) {
  if (!originalDate) return newDate;

  const hours = originalDate.getHours();
  const minutes = originalDate.getMinutes();
  const seconds = originalDate.getSeconds();
  const milliseconds = originalDate.getMilliseconds();

  newDate.setHours(hours, minutes, seconds, milliseconds);
  return newDate;
}

export function capitalize(str: string): string {
  if (str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getFirstWeekdayAfter(startDate: Date, targetWeekday: Weekday): Date {
  const targetWeekdayNumber = weekdays.indexOf(targetWeekday) as Day;
  const nextTargetDate = nextDay(subDays(startDate, 1), targetWeekdayNumber);

  return nextTargetDate;
}

export function strToBoolean(str: string): boolean {
  return str.toLowerCase() === "true";
}

export function transposeTime(sourceDate: Date, targetDate: Date): Date {
  const resultDate = new Date(targetDate);

  const hours = sourceDate.getHours();
  const minutes = sourceDate.getMinutes();
  const seconds = sourceDate.getSeconds();
  const milliseconds = sourceDate.getMilliseconds();

  resultDate.setHours(hours);
  resultDate.setMinutes(minutes);
  resultDate.setSeconds(seconds);
  resultDate.setMilliseconds(milliseconds);

  return resultDate;
}

export function getMinutesSinceMidnight(date: Date) {
  const hours = getHours(date);
  const minutes = getMinutes(date);
  return hours * 60 + minutes;
}

export function getInitials(name: string) {
  const [first, second, ...other] = name.split(" ");
  return first.charAt(0).toUpperCase() + second.charAt(0).toUpperCase();
}

export function getHourStrFromDate(date: Date) {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatDate(date: Date): string {
  return date.toLocaleString("en-US");
}

export function getFirstName(name: string) {
  return name.split(" ").shift();
}

export function colorize(index: number) {
  const colors = ["bg-light-purple", "bg-light-yellow", "bg-light-green", "bg-light-blue"];
  const mod = index % colors.length;
  return colors[mod];
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function subtractTimeStrings(startTime: string, endTime: string): number {
  // Parse the time strings to Date objects (using a reference date, e.g., 1970-01-01)
  const formatString = "HH:mm";
  const referenceDate = "1970-01-01"; // a placeholder date for parsing time

  const start = parse(startTime, formatString, new Date(referenceDate));
  const end = parse(endTime, formatString, new Date(referenceDate));

  // Calculate the difference in minutes
  const difference = differenceInMinutes(end, start);

  return difference;
}
