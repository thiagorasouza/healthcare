import { expect } from "@jest/globals";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { Slots } from "@/server/domain/slots";

const day1 = () => new Date("2024-01-01T05:00:00.000Z");
const day2 = () => new Date("2024-01-02T05:00:00.000Z");
const day3 = () => new Date("2024-01-03T05:00:00.000Z");
const day1Str = day1().toISOString();
const day2Str = day2().toISOString();
const day3Str = day3().toISOString();

export const mockSingleDate = (day: Date, startHour = 10, endHour = 11) => ({
  startDate: day,
  endDate: day,
  startTime: new Date(day.setHours(startHour, 0, 0, 0)),
  endTime: new Date(day.setHours(endHour, 0, 0, 0)),
  duration: 30,
  recurring: false,
  weekdays: [],
  doctorId: "any_id",
});

export const mockRecurringPattern = (startTime = 8, endTime = 10) => ({
  startDate: day1(),
  endDate: day2(),
  startTime: new Date(day1().setHours(startTime, 0, 0, 0)),
  endTime: new Date(day1().setHours(endTime, 0, 0, 0)),
  duration: 30,
  recurring: true,
  weekdays: ["mon", "tue"] as Weekday[],
  doctorId: "any_id",
});

const makeSut = () => {
  return new Slots();
};

describe("Slots Test Suite", () => {
  it("should parse a single date", () => {
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
