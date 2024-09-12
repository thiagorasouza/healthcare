import { expect, jest, test } from "@jest/globals";
import { mockRecurringPattern, mockSingleDate } from "@/__tests__/mocks/pattern.mock";
import { getSlots } from "@/lib/processing/getSlots";

describe("getSlotsFromPatterns Test Suite", () => {
  it("should return slots for a single date", () => {
    const singleDateMock = mockSingleDate(10, 11);
    const result = getSlots([singleDateMock]);
    expect(result).toStrictEqual({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
      ],
    });
  });

  it("should return slots for a recurring pattern", () => {
    const recurringPatternMock = mockRecurringPattern(8, 10);
    const result = getSlots([recurringPatternMock]);
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
    const result = getSlots([singleDateMock, recurringPatternMock]);
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
    const result = getSlots([singleDateMock1, singleDateMock2]);
    expect(result).toStrictEqual({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
        ["11:00", "11:30"],
        ["11:30", "12:00"],
      ],
    });
  });

  it("should return slots for two recurring patterns", () => {
    const recurringPatternMock1 = mockRecurringPattern(10, 11);
    const recurringPatternMock2 = mockRecurringPattern(11, 12);
    const result = getSlots([recurringPatternMock1, recurringPatternMock2]);
    expect(result).toStrictEqual({
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
    });
  });
});
