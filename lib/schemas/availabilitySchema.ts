import { differenceInMonths } from "date-fns";
import { z } from "zod";

export const weekdays: Weekday[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const isMultipleOf = (num: number, divisor: number) => num % divisor === 0;

export const availabilitySchema = z
  .object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    duration: z.coerce.number({ message: "Only number allowed " }).min(1),
    recurring: z.coerce.boolean(),
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

export const avDefaultValues = {
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  duration: 0,
  recurring: false,
  weekdays: [],
};

export type AvailabilityData = z.infer<typeof availabilitySchema>;
