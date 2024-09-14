import { weekdays } from "@/server/config/constants";

export function getHoursStr(date: Date) {
  // console.log("🚀 ~ date:", date);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getWeekday(date: Date) {
  const weekdayNum = date.getDay();
  return weekdays[weekdayNum];
}

export function getDateStr(date: Date) {
  return startOfDay(date).toISOString();
}

export function addMinutes(date: Date, minutes: number) {
  const dateCopy = new Date(date);
  return new Date(dateCopy.setMinutes(date.getMinutes() + minutes));
}

export function startOfDay(date: Date) {
  const dateCopy = new Date(date);
  return new Date(dateCopy.setHours(0, 0, 0, 0));
}
