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

const makeSut = () => {
  return new Slots();
};

describe("Slots Test Suite", () => {
  it("should parse 1 single date", () => {
    const singleDateMock = [mockSingleDate(day1())];
    const sut = makeSut();
    sut.source(singleDateMock).parse();
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
    const singleDateMock = [mockSingleDate(day1()), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(singleDateMock).parse();
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
    const recurringPatternMock = [mockRecurringPattern(day1(), day2(), 8, 10)];
    const sut = makeSut();
    sut.source(recurringPatternMock).parse();
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
    const recurringPatternMock = [
      mockRecurringPattern(day1(), day2(), 8, 9),
      mockRecurringPattern(day1(), day2(), 9, 10),
    ];
    const sut = makeSut();
    sut.source(recurringPatternMock).parse();
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

  it("should sort patterns in mixed order", () => {
    const recurringPatternMock = [
      mockRecurringPattern(day1(), day2(), 9, 10),
      mockRecurringPattern(day1(), day2(), 8, 9),
    ];
    const sut = makeSut();
    sut.source(recurringPatternMock).parse().sort();
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

  it("should return only dates after start", () => {
    const singleDatesMock = [mockSingleDate(day1()), mockSingleDate(day3(), 10, 11)];
    const sut = makeSut();
    sut.source(singleDatesMock).start(day2()).parse();
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
    const singleDatesMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day3())];
    const sut = makeSut();
    sut.source(singleDatesMock).end(day2()).parse();
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
    const singleDatesMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(singleDatesMock).date(day1()).parse();
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
    const singleDatesMock = [mockSingleDate(day1(), 10, 11), mockSingleDate(day2())];
    const sut = makeSut();
    sut.source(singleDatesMock).weekdays([day1Weekday]).parse();
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

  // it("should return an empty Map if date provided does not match pattern", () => {
  //   const recurringPatternMock = mockRecurringPattern();
  //   const result = Slots.read([recurringPatternMock], {
  //     exactDate: new Date("2024-01-03T05:00:00.000Z"),
  //   });
  //   expect(result).toStrictEqual(new Map());
  // });
  // it("should return an empty Map if date provided does not match single date", () => {
  //   const singleDateMock = mockSingleDate();
  //   const result = Slots.read([singleDateMock], {
  //     exactDate: new Date("2024-01-03T05:00:00.000Z"),
  //   });
  //   expect(result).toStrictEqual(new Map());
  // });
  // it("should return slots for a single date", () => {
  //   const singleDateMock = mockSingleDate(10, 11);
  //   const result = Slots.read([singleDateMock]);
  //   expect(result).toStrictEqual(
  //     new Map(
  //       Object.entries({
  //         "2024-01-01T05:00:00.000Z": [
  //           ["10:00", "10:30"],
  //           ["10:30", "11:00"],
  //         ],
  //       }),
  //     ),
  //   );
  // });
  // it("should return slots for a recurring pattern", () => {
  //   const recurringPatternMock = mockRecurringPattern(8, 10);
  //   const result = Slots.read([recurringPatternMock]);
  //   expect(result).toStrictEqual(
  //     new Map(
  //       Object.entries({
  //         "2024-01-01T05:00:00.000Z": [
  //           ["08:00", "08:30"],
  //           ["08:30", "09:00"],
  //           ["09:00", "09:30"],
  //           ["09:30", "10:00"],
  //         ],
  //         "2024-01-02T05:00:00.000Z": [
  //           ["08:00", "08:30"],
  //           ["08:30", "09:00"],
  //           ["09:00", "09:30"],
  //           ["09:30", "10:00"],
  //         ],
  //       }),
  //     ),
  //   );
  // });
  // it("should return slots for a single date and a recurring pattern", () => {
  //   const singleDateMock = mockSingleDate(10, 11);
  //   const recurringPatternMock = mockRecurringPattern(8, 10);
  //   const result = Slots.read([singleDateMock, recurringPatternMock]);
  //   expect(result).toStrictEqual(
  //     new Map(
  //       Object.entries({
  //         "2024-01-01T05:00:00.000Z": [
  //           ["08:00", "08:30"],
  //           ["08:30", "09:00"],
  //           ["09:00", "09:30"],
  //           ["09:30", "10:00"],
  //           ["10:00", "10:30"],
  //           ["10:30", "11:00"],
  //         ],
  //         "2024-01-02T05:00:00.000Z": [
  //           ["08:00", "08:30"],
  //           ["08:30", "09:00"],
  //           ["09:00", "09:30"],
  //           ["09:30", "10:00"],
  //         ],
  //       }),
  //     ),
  //   );
  // });
  // it("should return slots for two single dates", () => {
  //   const singleDateMock1 = mockSingleDate(10, 11);
  //   const singleDateMock2 = mockSingleDate(11, 12);
  //   const result = Slots.read([singleDateMock1, singleDateMock2]);
  //   expect(result).toStrictEqual(
  //     new Map(
  //       Object.entries({
  //         "2024-01-01T05:00:00.000Z": [
  //           ["10:00", "10:30"],
  //           ["10:30", "11:00"],
  //           ["11:00", "11:30"],
  //           ["11:30", "12:00"],
  //         ],
  //       }),
  //     ),
  //   );
  // });
  // it("should return slots for two recurring patterns", () => {
  //   const recurringPatternMock1 = mockRecurringPattern(10, 11);
  //   const recurringPatternMock2 = mockRecurringPattern(11, 12);
  //   const result = Slots.read([recurringPatternMock1, recurringPatternMock2]);
  //   expect(result).toStrictEqual(
  //     new Map(
  //       Object.entries({
  //         "2024-01-01T05:00:00.000Z": [
  //           ["10:00", "10:30"],
  //           ["10:30", "11:00"],
  //           ["11:00", "11:30"],
  //           ["11:30", "12:00"],
  //         ],
  //         "2024-01-02T05:00:00.000Z": [
  //           ["10:00", "10:30"],
  //           ["10:30", "11:00"],
  //           ["11:00", "11:30"],
  //           ["11:30", "12:00"],
  //         ],
  //       }),
  //     ),
  //   );
  // });
});
