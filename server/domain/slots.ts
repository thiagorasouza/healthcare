import { weekdays } from "@/server/config/constants";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import {
  getDateStr,
  getHoursStr,
  getWeekday,
  setToMidnightUTC,
} from "@/server/useCases/shared/helpers/date";
import { addDays, addMinutes, getDay, isAfter, isBefore, isSameDay } from "date-fns";

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

  public static from(patterns: PatternModel[], options: Options) {
    const slots = new Slots();
    return slots
      .source(patterns)
      .start(options.start)
      .end(options.end)
      .date(options.date)
      .weekdays(options.weekdays)
      .parse()
      .sort()
      .get();
  }

  public source(source: PatternModel[]) {
    this.patterns = source;
    return this;
  }

  public start(start?: Date) {
    this.options.start = start;
    return this;
  }

  public end(end?: Date) {
    this.options.end = end;
    return this;
  }

  public date(date?: Date) {
    this.options.date = date;
    return this;
  }

  public weekdays(weekdays?: Weekday[]) {
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

    return this;
  }

  public sort() {
    for (const slots of this.data.values()) {
      slots.sort((a, b) => (a[0] < b[0] ? -1 : 1));
    }

    return this;
  }

  public get() {
    return this.data;
  }

  public isValid(startTime: Date, duration: number) {
    const dateStr = getDateStr(startTime);
    const startStr = getHoursStr(startTime);
    const endStr = getHoursStr(addMinutes(startTime, duration));

    for (const [date, slots] of this.data.entries()) {
      if (date === dateStr) {
        const startMatches = slots.some((slot) => slot[0] === startStr && slot[1] === endStr);
        if (startMatches) {
          return true;
        }
      }
    }

    return false;
  }

  private parseSingleDate(pattern: PatternModel) {
    const { startDate, startTime, endTime, duration } = pattern;

    if (this.isDateOutOfRange(startDate)) {
      return;
    }

    const dateStr = getDateStr(startDate);
    const hoursArray = this.getHoursArray(startTime, endTime, duration);

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

    const hoursArray = this.getHoursArray(startTime, endTime, duration);

    let date = setToMidnightUTC(startDate);
    while (date <= endDate) {
      if (!this.isDateOutOfRange(date)) {
        const weekday = getWeekday(date);
        const weekdayMatches = weekdays.includes(weekday);

        if (weekdayMatches) {
          const dateStr = getDateStr(date);
          this.add(dateStr, hoursArray);
        }
      }

      date = addDays(date, 1);
    }
  }

  public add(dateStr: string, hours: string[][]) {
    const previousValue = this.data.get(dateStr);

    this.data.set(dateStr, previousValue ? previousValue.concat(hours) : hours);
  }

  public remove(startTime: Date) {
    const dateStr = getDateStr(startTime);
    const hoursStr = getHoursStr(startTime);
    const previousValue = this.data.get(dateStr);
    if (!previousValue) return;

    this.data.set(
      dateStr,
      previousValue.filter(([start]) => start !== hoursStr),
    );
  }

  public getHoursArray(startTime: Date, endTime: Date, duration: number) {
    const startTimeMs = startTime.getTime();
    const endTimeMs = endTime.getTime();
    const diffMs = endTimeMs - startTimeMs;
    const durationMs = duration * 60 * 1000;
    const slotsNum = diffMs / durationMs;

    const slots = [];
    for (let i = 0; i < slotsNum; i++) {
      const startMs = startTimeMs + durationMs * i;
      const endMs = startMs + durationMs;
      const startStr = getHoursStr(new Date(startMs));
      const endStr = getHoursStr(new Date(endMs));
      slots.push([startStr, endStr]);
    }

    return slots;
  }
}
