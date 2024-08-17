import { PatternData, Weekday } from "@/lib/schemas/patternsSchema";
import { getMinutesSinceMidnight } from "@/lib/utils";
import { areIntervalsOverlapping } from "date-fns";

export function hasConflictingSlots(userData: PatternData, dbData: PatternData) {
  const areDatesOverlapping = (data1: PatternData, data2: PatternData) => {
    const interval1 = { start: data1.startDate, end: data1.endDate };
    const interval2 = { start: data2.startDate, end: data2.endDate };
    return areIntervalsOverlapping(interval1, interval2, { inclusive: true });
  };

  const areTimesOverlapping = (data1: PatternData, data2: PatternData) => {
    const userStartMins = getMinutesSinceMidnight(data1.startTime);
    const userEndMins = getMinutesSinceMidnight(data1.endTime);
    const dbStartMins = getMinutesSinceMidnight(data2.startTime);
    const dbEndMins = getMinutesSinceMidnight(data2.endTime);
    if (userStartMins >= dbStartMins && userStartMins < dbEndMins) {
      return true;
    }
    if (userEndMins > dbStartMins && userEndMins <= dbEndMins) {
      return true;
    }
    return false;
  };

  if (userData.recurring && dbData.recurring) {
    const conflictingWeekdays = userData.weekdays.filter((weekday) =>
      dbData.weekdays.includes(weekday),
    ) as Weekday[];
    if (!conflictingWeekdays) {
      return false;
    }
  }

  return areDatesOverlapping(userData, dbData) && areTimesOverlapping(userData, dbData);
}
