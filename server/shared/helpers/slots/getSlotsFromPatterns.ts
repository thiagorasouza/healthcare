import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { getFirstWeekdayAfter, getHourStrFromDate } from "@/server/shared/helpers/dateHelpers";
import { addWeeks, differenceInWeeks, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";

interface LimitOptions {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  exactDate?: Date;
}

export function getSlotsFromPatterns(patterns: PatternModel[], limit?: LimitOptions): SlotsModel {
  const result = new Map() as SlotsModel;
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
      const startStr = getHourStrFromDate(new Date(startMs));
      const endStr = getHourStrFromDate(new Date(endMs));
      slots.push([startStr, endStr]);
    }

    if (!recurring) {
      if (
        (limit?.exactDate && !isSameDay(startDate, limit.exactDate)) ||
        (limit?.start && isBefore(startDate, limit.start)) ||
        (limit?.end && isAfter(startDate, limit.end))
      ) {
        continue;
      }

      const dateStr = getNormalizedDateStr(startDate);
      result.set(dateStr, result.has(dateStr) ? result.get(dateStr)!.concat(slots) : slots);
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
        result.set(dateStr, result.has(dateStr) ? result.get(dateStr)!.concat(slots) : slots);
      }
    }
  }

  for (const slots of result.values()) {
    slots.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  }
  return result;
}

function getNormalizedDateStr(date: Date) {
  return startOfDay(date).toISOString();
}
