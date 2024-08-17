import { PatternData, Weekday } from "@/lib/schemas/patternsSchema";
import { getFirstWeekdayAfter, transposeTime } from "@/lib/utils";
import { addWeeks, differenceInWeeks, format, isAfter, isBefore } from "date-fns";

interface LimitOptions {
  start: Date;
  end: Date;
  weekdays: Weekday[];
}

export function processSlots(data: PatternData, limit?: LimitOptions) {
  const {
    startDate,
    endDate,
    startTime,
    endTime,
    duration: durationMin,
    weekdays,
    recurring,
  } = data;
  // console.log("🚀 ~ endDate:", endDate);
  // console.log("🚀 ~ startDate:", startDate);
  // console.log("🚀 ~ weekdays:", weekdays);
  const weekdaysToLoop = (
    limit ? weekdays.filter((weekday) => limit.weekdays.includes(weekday as Weekday)) : weekdays
  ) as Weekday[];

  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const diffMs = endTimeMs - startTimeMs;
  const durationMs = durationMin * 60 * 1000;
  const slotsNum = diffMs / durationMs;

  const slotsToTranspose = [];
  // console.log("🚀 ~ slotsToTranspose:", slotsToTranspose);
  for (let i = 0; i < slotsNum; i++) {
    const slotStartMs = startTimeMs + durationMs * i;
    const slotEndMs = slotStartMs + durationMs;
    slotsToTranspose.push([new Date(slotStartMs), new Date(slotEndMs)]);
  }

  if (!recurring) {
    return [
      {
        date: format(startDate, "yyyy-MM-dd"),
        duration: durationMin,
        slots: slotsToTranspose,
      },
    ];
  }

  const result = [];
  const weeksNum = differenceInWeeks(endDate, startDate) + 1;
  // console.log("🚀 ~ weeksNum:", weeksNum);
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

      result.push({
        date: date.toISOString(),
        duration: durationMin,
        slots: transposedSlots,
      });
    }
  }

  return result;
}
