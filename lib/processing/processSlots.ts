import { PatternData, Weekday } from "@/lib/schemas/patternsSchema";
import { getFirstWeekdayAfter, transposeTime } from "@/lib/utils";
import { addWeeks, differenceInWeeks, format, isAfter, isBefore } from "date-fns";

interface LimitOptions {
  start: Date;
  end: Date;
  weekdays: Weekday[];
}

export function processSlots(data: PatternData, limit?: LimitOptions) {
  const { startDate, endDate, startTime, endTime, duration: durationMin } = data;
  const weekdaysToLoop = (
    limit
      ? data.weekdays.filter((weekday) => limit.weekdays.includes(weekday as Weekday))
      : data.weekdays
  ) as Weekday[];

  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const diffMs = endTimeMs - startTimeMs;
  const durationMs = durationMin * 60 * 1000;
  const slotsNum = diffMs / durationMs;

  const slotsToTranspose = [];
  for (let i = 0; i < slotsNum; i++) {
    const slotStartMs = startTimeMs + durationMs * i;
    const slotEndMs = slotStartMs + durationMs;
    slotsToTranspose.push([new Date(slotStartMs), new Date(slotEndMs)]);
  }

  const result = [];
  const weeksNum = differenceInWeeks(endDate, startDate) + 1;
  weeksLoop: for (let i = 0; i < weeksNum; i++) {
    for (const weekday of weekdaysToLoop) {
      const start = addWeeks(startDate, i);
      const date = getFirstWeekdayAfter(start, weekday);

      if (isAfter(date, endDate)) {
        break weeksLoop;
      }

      if (limit && isBefore(date, limit.start)) {
        break;
      }

      if (limit && isAfter(date, limit.end)) {
        break weeksLoop;
      }

      const transposedSlots = slotsToTranspose.map(([slotStart, slotEnd]) => {
        return [transposeTime(slotStart, date), transposeTime(slotEnd, date)];
      });
      const formattedDate = format(date, "yyyy-MM-dd");

      result.push({
        date: formattedDate,
        duration: durationMin,
        slots: transposedSlots,
      });
    }
  }

  return result;
}
