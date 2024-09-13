import { expect } from "@jest/globals";
import { Weekday } from "@/server/domain/models/patternModel";
import { Slots } from "@/server/domain/slots";

export const mockSingleDate = (startTime = 10, endTime = 11) => ({
  startDate: new Date("2024-01-01T05:00:00.000Z"),
  endDate: new Date("2024-01-01T05:00:00.000Z"),
  startTime: new Date(new Date().setHours(startTime, 0, 0, 0)),
  endTime: new Date(new Date().setHours(endTime, 0, 0, 0)),
  duration: 30,
  recurring: false,
  weekdays: [],
  doctorId: "any_id",
});

export const mockRecurringPattern = (startTime = 8, endTime = 10) => ({
  startDate: new Date("2024-01-01T05:00:00.000Z"),
  endDate: new Date("2024-01-02T05:00:00.000Z"),
  startTime: new Date(new Date().setHours(startTime, 0, 0, 0)),
  endTime: new Date(new Date().setHours(endTime, 0, 0, 0)),
  duration: 30,
  recurring: true,
  weekdays: ["mon", "tue"] as Weekday[],
  doctorId: "any_id",
});

describe("Slots Test Suite", () => {
  it("should return an empty Map if date provided does not match pattern", () => {
    const recurringPatternMock = mockRecurringPattern();
    const result = Slots.create([recurringPatternMock], {
      exactDate: new Date("2024-01-03T05:00:00.000Z"),
    });
    expect(result).toStrictEqual(new Map());
  });

  it("should return an empty Map if date provided does not match single date", () => {
    const singleDateMock = mockSingleDate();
    const result = Slots.create([singleDateMock], {
      exactDate: new Date("2024-01-03T05:00:00.000Z"),
    });
    expect(result).toStrictEqual(new Map());
  });

  it("should return slots for a single date", () => {
    const singleDateMock = mockSingleDate(10, 11);
    const result = Slots.create([singleDateMock]);
    expect(result).toStrictEqual(
      new Map(
        Object.entries({
          "2024-01-01T05:00:00.000Z": [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
        }),
      ),
    );
  });

  it("should return slots for a recurring pattern", () => {
    const recurringPatternMock = mockRecurringPattern(8, 10);
    const result = Slots.create([recurringPatternMock]);
    expect(result).toStrictEqual(
      new Map(
        Object.entries({
          "2024-01-01T05:00:00.000Z": [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
          "2024-01-02T05:00:00.000Z": [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should return slots for a single date and a recurring pattern", () => {
    const singleDateMock = mockSingleDate(10, 11);
    const recurringPatternMock = mockRecurringPattern(8, 10);
    const result = Slots.create([singleDateMock, recurringPatternMock]);
    expect(result).toStrictEqual(
      new Map(
        Object.entries({
          "2024-01-01T05:00:00.000Z": [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
            ["10:00", "10:30"],
            ["10:30", "11:00"],
          ],
          "2024-01-02T05:00:00.000Z": [
            ["08:00", "08:30"],
            ["08:30", "09:00"],
            ["09:00", "09:30"],
            ["09:30", "10:00"],
          ],
        }),
      ),
    );
  });

  it("should return slots for two single dates", () => {
    const singleDateMock1 = mockSingleDate(10, 11);
    const singleDateMock2 = mockSingleDate(11, 12);
    const result = Slots.create([singleDateMock1, singleDateMock2]);
    expect(result).toStrictEqual(
      new Map(
        Object.entries({
          "2024-01-01T05:00:00.000Z": [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
            ["11:00", "11:30"],
            ["11:30", "12:00"],
          ],
        }),
      ),
    );
  });

  it("should return slots for two recurring patterns", () => {
    const recurringPatternMock1 = mockRecurringPattern(10, 11);
    const recurringPatternMock2 = mockRecurringPattern(11, 12);
    const result = Slots.create([recurringPatternMock1, recurringPatternMock2]);
    expect(result).toStrictEqual(
      new Map(
        Object.entries({
          "2024-01-01T05:00:00.000Z": [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
            ["11:00", "11:30"],
            ["11:30", "12:00"],
          ],
          "2024-01-02T05:00:00.000Z": [
            ["10:00", "10:30"],
            ["10:30", "11:00"],
            ["11:00", "11:30"],
            ["11:30", "12:00"],
          ],
        }),
      ),
    );
  });
});
