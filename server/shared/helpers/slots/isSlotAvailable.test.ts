import { isSlotAvailable } from "@/server/shared/helpers/slots/isSlotAvailable";
import { expect } from "@jest/globals";
import { setHours } from "date-fns";

const mockSlots = () =>
  new Map(
    Object.entries({
      "2024-01-01T05:00:00.000Z": [
        ["10:00", "10:30"],
        ["10:30", "11:00"],
      ],
    }),
  );

describe("isSlotAvailable Test Suite", () => {
  it("should return false for mismatches", () => {
    const slotsMock = mockSlots();
    const startTime = setHours(new Date("2024-01-01T05:00:00.000Z"), 12);
    const result = isSlotAvailable(slotsMock, startTime);
    expect(result).toBe(false);
  });

  it("should true false for matching slots", () => {
    const slotsMock = mockSlots();
    const startTime = setHours(new Date("2024-01-01T05:00:00.000Z"), 10);
    const result = isSlotAvailable(slotsMock, startTime);
    expect(result).toBe(true);
  });
});
