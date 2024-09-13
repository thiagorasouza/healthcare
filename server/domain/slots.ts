import { weekdays } from "@/server/config/constants";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { getFirstWeekdayAfter, getHourStrFromDate } from "@/server/shared/helpers/dateHelpers";
import {
  addWeeks,
  differenceInWeeks,
  getDay,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";

interface Limits {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  exactDate?: Date;
}

export class Slots {
  private constructor(public readonly model: SlotsModel) {}

  public static create(patterns: PatternModel[], limits?: Limits) {
    const result = new Map() as SlotsModel;

    const pushSlots = (dateStr: string, slots: string[][]) =>
      result.set(dateStr, result.has(dateStr) ? result.get(dateStr)!.concat(slots) : slots);

    for (const pattern of patterns) {
      const { startDate, endDate, startTime, endTime, duration, weekdays, recurring } = pattern;

      const slots = Slots.getDailySlots(startTime, endTime, duration);

      if (!recurring) {
        if (!limits || !Slots.isDateOutOfLimits(startDate, limits)) {
          pushSlots(Slots.toNormalizedDateStr(startDate), slots);
        }
        continue;
      }

      let weekdaysToLoop = weekdays;
      if (limits?.weekdays) {
        weekdaysToLoop = weekdays.filter((weekday) =>
          limits.weekdays!.includes(weekday as Weekday),
        );
      }

      const weeksNum = differenceInWeeks(endDate, startDate) + 1;
      weeksLoop: for (let i = 0; i < weeksNum; i++) {
        for (const weekday of weekdaysToLoop) {
          const start = addWeeks(startDate, i);
          const date = getFirstWeekdayAfter(start, weekday);

          if (isAfter(date, endDate) || (limits?.end && isAfter(date, limits.end))) {
            break weeksLoop;
          }

          if (
            (limits?.exactDate && !isSameDay(date, limits.exactDate)) ||
            (limits?.start && isBefore(date, limits.start))
          ) {
            break;
          }

          pushSlots(Slots.toNormalizedDateStr(date), slots);
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

  public static isDateOutOfLimits(date: Date, limits: Limits) {
    return (
      (limits?.exactDate && !isSameDay(date, limits.exactDate)) ||
      (limits?.start && isBefore(date, limits.start)) ||
      (limits?.end && isAfter(date, limits.end)) ||
      (limits?.weekdays && !weekdays.includes(weekdays[getDay(date)]))
    );
  }

  public static toNormalizedDateStr(date: Date) {
    return startOfDay(date).toISOString();
  }
}
