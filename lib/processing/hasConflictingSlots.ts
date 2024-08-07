import { AvailabilityData, Weekday } from "@/lib/schemas/availabilitySchema";
import { getMinutesSinceMidnight } from "@/lib/utils";
import { areIntervalsOverlapping } from "date-fns";

export function hasConflictingSlots(userData: AvailabilityData, dbData: AvailabilityData) {
  const areDatesOverlapping = (data1: AvailabilityData, data2: AvailabilityData) => {
    const interval1 = { start: data1.startDate, end: data1.endDate };
    const interval2 = { start: data2.startDate, end: data2.endDate };
    return areIntervalsOverlapping(interval1, interval2, { inclusive: true });
  };

  const areTimesOverlapping = (data1: AvailabilityData, data2: AvailabilityData) => {
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
