import { weekdays } from "@/server/config/constants";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { getHourStrFromDate, getWeekDayFromDate } from "@/server/shared/helpers/dateHelpers";
import { addDays, getDay, isAfter, isBefore, isSameDay, startOfDay } from "date-fns";

interface Options {
  start?: Date;
  end?: Date;
  weekdays?: Weekday[];
  date?: Date;
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

  public end(end: Date) {
    this.options.end = end;
    return this;
  }

  public date(date: Date) {
    this.options.date = date;
    return this;
  }

  public weekdays(weekdays: Weekday[]) {
    this.options.weekdays = weekdays;
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

    if (this.isDateOutOfRange(startDate)) {
      return;
    }

    const dateStr = this.dateStr(startDate);
    const hoursArray = this.hoursArray(startTime, endTime, duration);

    this.add(dateStr, hoursArray);
  }

  public isDateOutOfRange(date: Date) {
    return (
      (this.options?.date && !isSameDay(date, this.options.date)) ||
      (this.options?.start && isBefore(date, this.options.start)) ||
      (this.options?.end && isAfter(date, this.options.end)) ||
      (this.options?.weekdays && !this.options.weekdays.includes(weekdays[getDay(date)]))
    );
  }

  private parseRecurringPattern(pattern: PatternModel) {
    const { startDate, endDate, startTime, endTime, duration, weekdays } = pattern;

    const hoursArray = this.hoursArray(startTime, endTime, duration);

    let date = startDate;
    while (date <= endDate) {
      if (this.isDateOutOfRange(date)) {
        continue;
      }

      const weekday = getWeekDayFromDate(date);
      const weekdayMatches = weekdays.includes(weekday);

      if (weekdayMatches) {
        const dateStr = this.dateStr(date);
        this.add(dateStr, hoursArray);
      }

      date = addDays(date, 1);
    }
  }

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

  //   for (const slots of model.values()) {
  //     slots.sort((a, b) => (a[0] < b[0] ? -1 : 1));
  //   }
}
