import { getHourStrFromDate } from "@/lib/utils";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { startOfDay } from "date-fns";

export function isSlotAvailable(slots: SlotsModel, startTime: Date): boolean {
  const startTimeDate = startOfDay(startTime);
  const dateStr = startTimeDate.toISOString();
  const hoursStr = getHourStrFromDate(startTime);

  for (const [date, hours] of slots.entries()) {
    if (date === dateStr) {
      const matchingHours = hours.some((slot) => slot[0] === hoursStr);
      if (matchingHours) {
        return true;
      }
    }
  }

  return false;
}
