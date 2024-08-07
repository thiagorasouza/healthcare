import { AvailabilityData, Weekday } from "@/lib/schemas/availabilitySchema";
import { getFirstWeekdayAfter, transposeTime } from "@/lib/utils";
import { addWeeks, differenceInWeeks, format, isAfter, isBefore } from "date-fns";

interface LimitOptions {
  start: Date;
  end: Date;
  weekdays: Weekday[];
}

export function getSlots(data: AvailabilityData, limit?: LimitOptions) {
  const { startDate, endDate, startTime, endTime, duration: durationMin } = data;
  const weekdaysToLoop = (
    limit
      ? data.weekdays.filter((weekday) => limit.weekdays.includes(weekday as Weekday))
      : data.weekdays
  ) as Weekday[];
  // console.log("🚀 ~ weekdaysToLoop:", weekdaysToLoop);

  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const diffMs = endTimeMs - startTimeMs;
  const durationMs = durationMin * 60 * 1000;
  const slotsNum = diffMs / durationMs;

  const slotsToTranspose = [];
  for (let i = 0; i < slotsNum; i++) {
    const slotStartMs = startTimeMs + durationMs * i;
    const slotEndMs = slotStartMs + durationMs;
    slotsToTranspose.push([new Date(slotStartMs), new Date(slotEndMs)]);
  }
  // console.log("🚀 ~ slotsToTranspose:", slotsToTranspose);

  const result = [];
  const weeksNum = differenceInWeeks(endDate, startDate) + 1;
  weeksLoop: for (let i = 0; i < weeksNum; i++) {
    for (const weekday of weekdaysToLoop) {
      const start = addWeeks(startDate, i);
      const date = getFirstWeekdayAfter(start, weekday);

      if (isAfter(date, endDate)) {
        break weeksLoop;
      }

      if (limit && isBefore(date, limit.start)) {
        break;
      }

      if (limit && isAfter(date, limit.end)) {
        break weeksLoop;
      }

      const transposedSlots = slotsToTranspose.map(([slotStart, slotEnd]) => {
        return [transposeTime(slotStart, date), transposeTime(slotEnd, date)];
      });
      const formattedDate = format(date, "yyyy-MM-dd");

      result.push({
        date: formattedDate,
        duration: durationMin,
        slots: transposedSlots,
      });
    }
  }

  return result;
}

// const mockData = {
//   startTime: new Date("2024-08-08T11:00:00.000+00:00"),
//   endTime: new Date("2024-08-08T18:00:00.000+00:00"),
//   startDate: new Date("2024-08-08T05:00:00.000+00:00"),
//   endDate: new Date("2024-08-30T04:59:59.999+00:00"),
//   weekdays: ["mon", "wed"],
//   duration: 60,
//   recurring: true,
//   $id: "66b03555001d2713ff95",
//   $tenant: "165330",
//   $createdAt: "2024-08-05T02:13:41.830+00:00",
//   $updatedAt: "2024-08-05T02:13:41.830+00:00",
//   $permissions: [],
//   doctorId: {},
//   $databaseId: "6695bc47003220037191",
//   $collectionId: "6695bd4c00204c0df0aa",
// };

// getSlots(mockData);
