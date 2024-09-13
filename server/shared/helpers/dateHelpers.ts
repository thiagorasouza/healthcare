import { weekdays } from "@/server/config/constants";
import { Weekday } from "@/server/domain/models/patternModel";
import { Day, nextDay, subDays } from "date-fns";

export function getHourStrFromDate(date: Date) {
  // console.log("🚀 ~ date:", date);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getWeekDayFromDate(date: Date) {
  const weekdayNum = date.getDay();
  return weekdays[weekdayNum];
}
