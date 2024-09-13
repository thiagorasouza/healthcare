import { expect } from "@jest/globals";
import { Weekday } from "@/server/domain/models/patternModel";
import { Slots } from "@/server/domain/slots";
import { weekdays } from "@/server/config/constants";

const day1 = () => new Date("2024-01-01T05:00:00.000Z");
const day2 = () => new Date("2024-01-02T05:00:00.000Z");
const day3 = () => new Date("2024-01-03T05:00:00.000Z");
const day1Str = day1().toISOString();
const day2Str = day2().toISOString();
const day3Str = day3().toISOString();
const day1Weekday = weekdays[day1().getDay()];
const day2Weekday = weekdays[day2().getDay()];
const day3Weekday = weekdays[day3().getDay()];

export const mockSingleDate = (day: Date, startHour = 10, endHour = 11) => ({
  startDate: day,
  endDate: day,
  startTime: new Date(new Date(day).setHours(startHour, 0, 0, 0)),
  endTime: new Date(new Date(day).setHours(endHour, 0, 0, 0)),
  duration: 30,
  recurring: false,
  weekdays: [],
  doctorId: "any_id",
});

export const mockRecurringPattern = (start: Date, end: Date, startTime = 8, endTime = 10) => {
  const startDay = start.getDay();
  const startWeekday = weekdays[startDay];
  const dayAfterStartWeekday = weekdays[(startDay + 1) % 6];

  return {
    startDate: start,
    endDate: end,
    startTime: new Date(new Date(start).setHours(startTime, 0, 0, 0)),
    endTime: new Date(new Date(start).setHours(endTime, 0, 0, 0)),
    duration: 30,
    recurring: true,
    weekdays: [startWeekday, dayAfterStartWeekday] as Weekday[],
    doctorId: "any_id",
  };
};

export const mockSlot = (date: Date, hours: number, minutes: number) => {
  return new Date(new Date(date).setHours(hours, minutes, 0, 0));
};

const makeSut = () => {
  return new Slots();
};

describe("Slots Test Suite", () => {
  it("should parse 1 single date", () => {
    const patternsMock = [mockSingleDate(day1())];
    const sut = makeSut();
    sut.source(patternsMock).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should parse 2 single dates", () => {
    const patternsMock = [mockSingleDate(day1()), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(patternsMock).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
          [day2Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should parse 1 recurring pattern", () => {
    const patternsMock = [mockRecurringPattern(day1(), day2(), 8, 10)];
    const sut = makeSut();
    sut.source(patternsMock).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
          [day2Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should parse 2 recurring patterns", () => {
    const patternsMock = [
      mockRecurringPattern(day1(), day2(), 8, 9),
      mockRecurringPattern(day1(), day2(), 9, 10),
    ];
    const sut = makeSut();
    sut.source(patternsMock).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
          [day2Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should parse 1 single date and 1 recurring pattern", () => {
    const patternsMock = [
      mockRecurringPattern(day1(), day2(), 8, 9),
      mockSingleDate(day2(), 9, 10),
    ];
    const sut = makeSut();
    sut.source(patternsMock).parse().sort();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
          ],
          [day2Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should sort patterns in mixed order", () => {
    const patternsMock = [
      mockSingleDate(day2(), 10, 11),
      mockRecurringPattern(day1(), day2(), 9, 10),
      mockRecurringPattern(day1(), day2(), 8, 9),
    ];
    const sut = makeSut();
    sut.source(patternsMock).parse().sort();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
          [day2Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should return only dates after start", () => {
    const patternsMock = [mockSingleDate(day1()), mockSingleDate(day3(), 10, 11)];
    const sut = makeSut();
    sut.source(patternsMock).start(day2()).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day3Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should return only dates before end", () => {
    const patternsMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day3())];
    const sut = makeSut();
    sut.source(patternsMock).end(day2()).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should return only the date specified", () => {
    const patternsMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(patternsMock).date(day1()).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should return only the specified weekdays", () => {
    const patternsMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(patternsMock).weekdays([day1Weekday]).parse();
    expect(sut.get()).toStrictEqual(
      new Map(
        Object.entries({
          [day1Str]: [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should parse, sort and return slots when Slots.from is used", () => {
    const patternsMock = [
      mockSingleDate(day3(), 10, 11),
      mockRecurringPattern(day1(), day2(), 9, 10),
      mockRecurringPattern(day1(), day2(), 8, 9),
    ];
    const sut = makeSut();

    const slots = Slots.from(patternsMock, { start: day2(), weekdays: [day2Weekday] });

    expect(slots).toStrictEqual(
      new Map(
        Object.entries({
          [day2Str]: [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should return false if slot is not valid", () => {
    const patternsMock = [mockSingleDate(day1(), 10, 12)];
    const slotMock = mockSlot(day1(), 12, 0);

    const sut = makeSut();
    sut.source(patternsMock).parse().sort();

    expect(sut.isValid(slotMock)).toBe(false);
  });

  it("should return true if slot is valid", () => {
    const patternsMock = [mockSingleDate(day1(), 10, 12)];
    const slotMock = mockSlot(day1(), 11, 30);

    const sut = makeSut();
    sut.source(patternsMock).parse().sort();

    expect(sut.isValid(slotMock)).toBe(true);
  });
});
