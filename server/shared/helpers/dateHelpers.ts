import { weekdays } from "@/server/config/constants";
import { startOfDay } from "date-fns";

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
