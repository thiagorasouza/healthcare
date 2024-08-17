import { countSlotsInTimespan } from "@/lib/processing/countSlotsInTimespan";
import { PatternData, Weekday } from "@/lib/schemas/patternsSchema";
import { getFirstWeekdayAfter } from "@/lib/utils";

export function hasSlots(data: PatternData) {
  const { startTime, endTime, startDate, endDate, duration, weekdays } = data;

  const hasPossibleWeekday = (weekdays as Weekday[]).some((weekday) => {
    const date = getFirstWeekdayAfter(startDate, weekday);
    return date <= endDate;
  });
  if (!hasPossibleWeekday) {
    return false;
  }

  const slotsInTimespan = countSlotsInTimespan(startTime, endTime, duration);
  if (slotsInTimespan === 0) {
    return false;
  }

  return true;
}
