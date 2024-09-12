import { weekdays } from "@/server/config/constants";
import { Weekday } from "@/server/domain/models/patternModel";
import { Day, nextDay, subDays } from "date-fns";

export function getFirstWeekdayAfter(startDate: Date, targetWeekday: Weekday): Date {
  const targetWeekdayNumber = weekdays.indexOf(targetWeekday) as Day;
  const nextTargetDate = nextDay(subDays(startDate, 1), targetWeekdayNumber);

  return nextTargetDate;
}

export function getHourStrFromDate(date: Date) {
  // console.log("🚀 ~ date:", date);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
