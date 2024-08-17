import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { differenceInMonths } from "date-fns";
import { z } from "zod";

export const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export const fullWeekdays = {
  sun: "Sunday",
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
};
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const isMultipleOf = (num: number, divisor: number) => num % divisor === 0;

export const patternSchema = z
  .object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    duration: z.coerce.number({ message: "Only number allowed " }).min(1),
    recurring: z.preprocess((val) => {
      if (typeof val === "boolean") {
        return val;
      } else {
        return typeof val === "string" && val.toLowerCase() === "true";
      }
    }, z.boolean()),
    weekdays: z.preprocess(
      (val) => (typeof val === "string" ? val.split(",") : val),
      z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one day.",
      }),
    ),
  })
  .superRefine(({ startTime, endTime }, ctx) => {
    if (startTime >= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Start time should be before end time",
        path: ["startTime"],
      });
    }
  })
  .superRefine(({ startTime, endTime, duration: durationStr }, ctx) => {
    const diff = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    const duration = Number(durationStr);

    if (duration > diff || !isMultipleOf(diff, duration)) {
      ctx.addIssue({
        code: "custom",
        message: "Duration should be a multiple of the available hours",
        path: ["duration"],
      });
    }
  })
  .superRefine(({ startTime, endTime, endDate }, ctx) => {
    if (endDate <= startTime || endDate <= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "End date should be before available date",
        path: ["endDate"],
      });
    }
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (differenceInMonths(endDate, startDate) > 3) {
      ctx.addIssue({
        code: "custom",
        message: "Please schedule a maximum of 3 months at a time",
        path: ["endDate"],
      });
    }
  });

export function parseDbData(dbData: PatternDocumentSchema) {
  return {
    ...dbData,
    startTime: new Date(dbData.startTime),
    endTime: new Date(dbData.endTime),
    startDate: new Date(dbData.startDate),
    endDate: new Date(dbData.endDate),
  };
}

export const patternDefaultValues = {
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  duration: 0,
  recurring: false,
  weekdays: [],
};

export type PatternData = z.infer<typeof patternSchema>;
