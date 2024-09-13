import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { getFirstWeekdayAfter, getHourStrFromDate } from "@/server/shared/helpers/dateHelpers";
import { addWeeks, differenceInWeeks, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";

interface Options {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  exactDate?: Date;
}

export class Slots {
  private constructor(public readonly model: SlotsModel) {}

  public static create(patterns: PatternModel[], options?: Options) {
    const result = new Map() as SlotsModel;

    for (const pattern of patterns) {
      const { startDate, endDate, startTime, endTime, duration, weekdays, recurring } = pattern;

      let weekdaysToLoop = weekdays;
      if (options?.weekdays) {
        weekdaysToLoop = weekdays.filter((weekday) =>
          options.weekdays!.includes(weekday as Weekday),
        );
      }

      const slots = Slots.getDailySlots(startTime, endTime, duration);

      if (!recurring) {
        if (
          (options?.exactDate && !isSameDay(startDate, options.exactDate)) ||
          (options?.start && isBefore(startDate, options.start)) ||
          (options?.end && isAfter(startDate, options.end))
        ) {
          continue;
        }

        const dateStr = startOfDay(startDate).toISOString();
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

          if (options?.exactDate && !isSameDay(date, options.exactDate)) {
            break;
          }

          if (options?.start && isBefore(date, options.start)) {
            break;
          }

          if (options?.end && isAfter(date, options.end)) {
            break weeksLoop;
          }

          const dateStr = startOfDay(date).toISOString();
          result.set(dateStr, result.has(dateStr) ? result.get(dateStr)!.concat(slots) : slots);
        }
      }
    }

    for (const slots of result.values()) {
      slots.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    }
    return result;
  }

  public static getDailySlots(startTime: Date, endTime: Date, duration: number) {
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

    return slots;
  }
}
