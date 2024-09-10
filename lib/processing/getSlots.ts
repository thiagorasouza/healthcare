import { Pattern, Weekday } from "@/lib/schemas/patternsSchema";
import { getFirstWeekdayAfter, getHourStrFromDate as getTimeStrFromDate } from "@/lib/utils";
import { addWeeks, differenceInWeeks, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";

/**
 * {
 *    "2024-08-30T00:00:000Z" : [["08:00", "08:30"], ["08:30", "09:00"], ...],
 *    "...": ....
 * }
 */
type SlotsByDate = {
  [key: string]: string[][];
};

interface LimitOptions {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  exactDate?: Date;
}

export function getSlots(patterns: Pattern[], limit?: LimitOptions): SlotsByDate {
  const result = {} as SlotsByDate;
  for (const pattern of patterns) {
    const { startDate, endDate, startTime, endTime, duration, weekdays, recurring } = pattern;

    let weekdaysToLoop = weekdays;
    if (limit?.weekdays) {
      weekdaysToLoop = weekdays.filter((weekday) => limit.weekdays!.includes(weekday as Weekday));
    }

    const startTimeMs = startTime.getTime();
    const endTimeMs = endTime.getTime();
    const diffMs = endTimeMs - startTimeMs;
    const durationMs = duration * 60 * 1000;
    const slotsNum = diffMs / durationMs;

    const slots = [];
    for (let i = 0; i < slotsNum; i++) {
      const startMs = startTimeMs + durationMs * i;
      const endMs = startMs + durationMs;
      const startStr = getTimeStrFromDate(new Date(startMs));
      const endStr = getTimeStrFromDate(new Date(endMs));
      slots.push([startStr, endStr]);
    }

    if (!recurring) {
      const dateStr = getNormalizedDateStr(startDate);
      result[dateStr] = Array.isArray(result[dateStr]) ? result[dateStr].concat(slots) : slots;
      continue;
    }

    const weeksNum = differenceInWeeks(endDate, startDate) + 1;
    weeksLoop: for (let i = 0; i < weeksNum; i++) {
      for (const weekday of weekdaysToLoop) {
        const start = addWeeks(startDate, i);
        const date = getFirstWeekdayAfter(start, weekday);

        if (isAfter(date, endDate)) {
          break weeksLoop;
        }

        if (limit?.exactDate && !isSameDay(date, limit.exactDate)) {
          break;
        }

        if (limit?.start && isBefore(date, limit.start)) {
          break;
        }

        if (limit?.end && isAfter(date, limit.end)) {
          break weeksLoop;
        }

        const dateStr = getNormalizedDateStr(date);
        result[dateStr] = Array.isArray(result[dateStr]) ? result[dateStr].concat(slots) : slots;
      }
    }
  }

  for (const dateStr in result) {
    result[dateStr].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }
  return result;
}

function getNormalizedDateStr(date: Date) {
  return startOfDay(date).toISOString();
}
