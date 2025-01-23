import { toGCISoString } from "@/server/useCases/shared/helpers/date";
import { addMinutes } from "date-fns";

export function objectToFormData(obj: object) {
  const formData = new FormData();
  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) {
      continue;
    }
    // @ts-ignore
    const value = obj[property];
    formData.append(property, value instanceof Date ? value.toISOString() : value);
  }

  return formData;
}

export function formatList(arr: string[]) {
  return new Intl.ListFormat("en-US", { style: "long", type: "conjunction" }).format(arr);
}

export interface EventDetails {
  title: string;
  date: Date;
  duration: number;
  description: string;
}

export function createCalendarLink(event: EventDetails) {
  const baseUrl = "https://www.google.com/calendar/render?action=TEMPLATE";
  const params = new URLSearchParams({
    text: event.title,
    dates: `${toGCISoString(event.date)}/${toGCISoString(addMinutes(event.date, event.duration))}`,
    details: event.description,
    location: "Mednow",
    ctz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

  return `${baseUrl}&${params.toString()}`;
}

export function countSlotsInTimespan(startTime: Date, endTime: Date, durationMin: number) {
  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const diffMs = endTimeMs - startTimeMs;
  const durationMs = durationMin * 60 * 1000;
  const slotsNum = diffMs / durationMs;

  return slotsNum;
}
