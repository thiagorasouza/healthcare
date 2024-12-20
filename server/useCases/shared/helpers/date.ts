import { DURATION_UNIT, weekdays } from "@/server/config/constants";
import { set, startOfDay } from "date-fns";

export function getHoursStr(date: Date | string) {
  // console.log("🚀 ~ date:", date);
  return (typeof date === "string" ? new Date(date) : date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getHourMinNums(hourStr: string) {
  return hourStr.split(":").map((x) => Number(x));
}

export function joinDateTime(date: string, hourStr: string) {
  const [hours, minutes] = getHourMinNums(hourStr);

  return set(new Date(date), {
    hours,
    minutes,
    seconds: 0,
    milliseconds: 0,
  });
}

export function displayDate(date: Date) {
  return date.toLocaleDateString("pt-PT");
}

export function displayTime(date: Date) {
  return date.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function displayDuration(duration: number) {
  return `${duration} ${DURATION_UNIT}`;
}

export function getWeekday(date: Date) {
  const weekdayNum = date.getDay();
  return weekdays[weekdayNum];
}

export function getDateStr(date: Date) {
  return startOfDay(date).toISOString();
}

export function toGCISoString(date: Date) {
  const pad = (num: number) => String(num).padStart(2, "0"); // Pads single digits with a leading zero
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1); // Months are 0-indexed
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
