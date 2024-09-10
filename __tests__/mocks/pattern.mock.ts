import { documentMock } from "@/__tests__/mocks/document.mock";
import { Weekday } from "@/lib/schemas/patternsSchema";

export const mockSingleDate = (startTime = 10, endTime = 11) => ({
  startDate: new Date("2024-01-01T05:00:00.000Z"),
  endDate: new Date("2024-01-01T05:00:00.000Z"),
  startTime: new Date(new Date().setHours(startTime, 0, 0, 0)),
  endTime: new Date(new Date().setHours(endTime, 0, 0, 0)),
  duration: 30,
  recurring: false,
  weekdays: [],
  doctorId: "any_id",
  ...documentMock,
});

export const mockRecurringPattern = () => ({
  startDate: new Date("2024-01-01T05:00:00.000Z"),
  endDate: new Date("2024-01-02T05:00:00.000Z"),
  startTime: new Date(new Date().setHours(8, 0, 0, 0)),
  endTime: new Date(new Date().setHours(10, 0, 0, 0)),
  duration: 30,
  recurring: true,
  weekdays: ["mon", "tue"] as Weekday[],
  doctorId: "any_id",
  ...documentMock,
});
