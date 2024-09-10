import { expect, jest, test } from "@jest/globals";
import { mockRecurringPattern, mockSingleDate } from "@/__tests__/mocks/pattern.mock";
import { getSlotsByDate } from "@/lib/processing/getSlotsByDate";

describe("getSlotsByDate Test Suite", () => {
  it("should return slots for a single date", () => {
    const singleDateMock = mockSingleDate(10, 11);
    const result = getSlotsByDate([singleDateMock]);
    expect(result).toStrictEqual({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
      ],
    });
  });

  it("should return slots for a recurring pattern", () => {
    const recurringPatternMock = mockRecurringPattern(8, 10);
    const result = getSlotsByDate([recurringPatternMock]);
    expect(result).toStrictEqual({
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
    });
  });

  it("should return slots for a single date and a recurring pattern", () => {
    const singleDateMock = mockSingleDate(10, 11);
    const recurringPatternMock = mockRecurringPattern(8, 10);
    const result = getSlotsByDate([singleDateMock, recurringPatternMock]);
    expect(result).toStrictEqual({
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
    });
  });

  it("should return slots for two single dates", () => {
    const singleDateMock1 = mockSingleDate(10, 11);
    const singleDateMock2 = mockSingleDate(11, 12);
    const result = getSlotsByDate([singleDateMock1, singleDateMock2]);
    expect(result).toStrictEqual({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
        ["11:00", "11:30"],
        ["11:30", "12:00"],
      ],
    });
  });
});
