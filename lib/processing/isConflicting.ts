import { getSlots } from "@/lib/processing/getSlots";
import { AvailabilityData, Weekday } from "@/lib/schemas/availabilitySchema";
import { areIntervalsOverlapping, max, min } from "date-fns";

export function isConflicting(userData: AvailabilityData, dbData: AvailabilityData) {
  if (!userData.recurring || !dbData.recurring) {
    return;
  }

  const conflictingWeekdays = userData.weekdays.filter((weekday) =>
    dbData.weekdays.includes(weekday),
  ) as Weekday[];
  console.log("🚀 ~ conflictingWeekdays:", conflictingWeekdays);
  if (!conflictingWeekdays) {
    return false;
  }

  const userInterval = {
    start: userData.startDate,
    end: userData.endDate,
  };
  // console.log("🚀 ~ userInterval:", userInterval);
  const dbInterval = {
    start: dbData.startDate,
    end: dbData.endDate,
  };
  const overlaps = areIntervalsOverlapping(userInterval, dbInterval, { inclusive: true });
  if (!overlaps) {
    return false;
  }

  const overlapStart = max([userInterval.start, dbInterval.start]);
  console.log("🚀 ~ overlapStart:", overlapStart);
  const overlapEnd = min([userInterval.end, dbInterval.end]);
  console.log("🚀 ~ overlapEnd:", overlapEnd);

  const userSlotsList = getSlots(userData, {
    start: overlapStart,
    end: overlapEnd,
    weekdays: conflictingWeekdays,
  });
  // console.log("🚀 ~ userSlotsList:", userSlotsList);

  const dbSlotsList = getSlots(dbData, {
    start: overlapStart,
    end: overlapEnd,
    weekdays: conflictingWeekdays,
  });
  // console.log("🚀 ~ dbSlotsList:", dbSlotsList);

  for (const userDay of userSlotsList) {
    for (const dbDay of dbSlotsList) {
      if (userDay.date !== dbDay.date) break;

      for (const userDaySlot of userDay.slots) {
        for (const dbDaySlot of dbDay.slots) {
          const [userSlotStart, userSlotEnd] = userDaySlot;
          const [dbSlotStart, dbSlotEnd] = dbDaySlot;

          if (userSlotStart >= dbSlotStart && userSlotStart < dbSlotEnd) {
            return true;
          }

          if (userSlotEnd > dbSlotStart && userSlotEnd <= dbSlotEnd) {
            return true;
          }
        }
      }
    }
  }

  return false;
}
