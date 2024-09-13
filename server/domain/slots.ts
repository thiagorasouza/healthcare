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

interface Options {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  exactDate?: Date;
}

// Purpose:
// 1. Should represent slots from a group of patterns
// 2. Should check for slot availability

export class Slots {
  private options: Options;
  private readonly data: SlotsModel;
  private patterns: PatternModel[];

  public constructor() {
    this.data = new Map();
    this.patterns = [];
    this.options = {};
  }

  // public static from(patterns: PatternModel[]) {
  //   const slots = new Slots(patterns);
  //   return slots;
  // }

  public source(source: PatternModel[]) {
    this.patterns = source;
    return this;
  }

  public start(start: Date) {
    this.options.start = start;
    return this;
  }

  public parse() {
    for (const pattern of this.patterns) {
      const isSingleDate = !pattern.recurring;

      if (isSingleDate) {
        this.parseSingleDate(pattern);
      } else {
        this.parseRecurringPattern(pattern);
      }
    }
  }

  public get() {
    return this.data;
  }

  private parseSingleDate(pattern: PatternModel) {
    const { startDate, startTime, endTime, duration } = pattern;

    const singleDateStr = this.dateStr(startDate);
    const hoursArray = this.hoursArray(startTime, endTime, duration);

    this.add(singleDateStr, hoursArray);
  }

  private parseRecurringPattern(pattern: PatternModel) {}

  public add(dateStr: string, hours: string[][]) {
    const previousValue = this.data.get(dateStr);

    this.data.set(dateStr, previousValue ? previousValue.concat(hours) : hours);
  }

  public dateStr(date: Date) {
    return startOfDay(date).toISOString();
  }

  public hoursArray(startTime: Date, endTime: Date, duration: number) {
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

  // public isAvailable(slots: Slots, startTime: Date) {
  //   const startTimeDate = startOfDay(startTime);
  //   const dateStr = startTimeDate.toISOString();
  //   const hoursStr = getHourStrFromDate(startTime);

  //   for (const [date, hours] of slots.data.entries()) {
  //     if (date === dateStr) {
  //       const matchingHours = hours.some((slot) => slot[0] === hoursStr);
  //       if (matchingHours) {
  //         return true;
  //       }
  //     }
  //   }

  //   return false;
  // }

  // public static readDay(patterns: PatternModel[], day: Date) {
  //   return Slots.read(patterns, { exactDate: day });
  // }

  // public static read(patterns: PatternModel[], limits?: Limits) {
  //   const model: SlotsModel = new Map();

  //   const pushSlots = (dateStr: string, slots: string[][]) =>
  //     model.set(dateStr, model.has(dateStr) ? model.get(dateStr)!.concat(slots) : slots);

  //   for (const pattern of patterns) {
  //     const { startDate, endDate, startTime, endTime, duration, weekdays, recurring } = pattern;

  //     const slots = Slots.hoursArray(startTime, endTime, duration);

  //     if (!recurring) {
  //       if (!limits || !Slots.isDateOutOfLimits(startDate, limits)) {
  //         pushSlots(Slots.toNormalizedDateStr(startDate), slots);
  //       }
  //       continue;
  //     }

  //     let weekdaysToLoop = weekdays;
  //     if (limits?.weekdays) {
  //       weekdaysToLoop = weekdays.filter((weekday) =>
  //         limits.weekdays!.includes(weekday as Weekday),
  //       );
  //     }

  //     const weeksNum = differenceInWeeks(endDate, startDate) + 1;
  //     weeksLoop: for (let i = 0; i < weeksNum; i++) {
  //       for (const weekday of weekdaysToLoop) {
  //         const start = addWeeks(startDate, i);
  //         const date = getFirstWeekdayAfter(start, weekday);

  //         if (isAfter(date, endDate) || (limits?.end && isAfter(date, limits.end))) {
  //           break weeksLoop;
  //         }

  //         if (
  //           (limits?.exactDate && !isSameDay(date, limits.exactDate)) ||
  //           (limits?.start && isBefore(date, limits.start))
  //         ) {
  //           break;
  //         }

  //         pushSlots(Slots.toNormalizedDateStr(date), slots);
  //       }
  //     }
  //   }

  //   for (const slots of model.values()) {
  //     slots.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  //   }

  //   return model;
  // }

  // public static isDateOutOfLimits(date: Date, limits: Limits) {
  //   return (
  //     (limits?.exactDate && !isSameDay(date, limits.exactDate)) ||
  //     (limits?.start && isBefore(date, limits.start)) ||
  //     (limits?.end && isAfter(date, limits.end)) ||
  //     (limits?.weekdays && !weekdays.includes(weekdays[getDay(date)]))
  //   );
  // }

  // public static toNormalizedDateStr(date: Date) {
  //   return startOfDay(date).toISOString();
  // }
}
