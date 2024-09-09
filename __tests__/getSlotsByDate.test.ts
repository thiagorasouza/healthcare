import { expect, jest, test } from "@jest/globals";
import { mockRecurringPattern, mockSingleDate } from "@/__tests__/mocks/pattern.mock";
import { getSlotsByDate } from "@/lib/processing/getSlotsByDate";

describe("getSlotsByDate Test Suite", () => {
  it("should return slots for a single date", () => {
    const singleDateMock = mockSingleDate();
    const result = getSlotsByDate(singleDateMock);
    expect(result).toStrictEqual({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
      ],
    });
  });

  it("should return slots for a recurring pattern", () => {
    const recurringPatternMock = mockRecurringPattern();
    const result = getSlotsByDate(recurringPatternMock);
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
});
