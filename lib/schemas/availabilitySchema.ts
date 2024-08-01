import { z } from "zod";

export const weekdays = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

const isMultipleOf = (num: number, divisor: number) => num % divisor === 0;

export const availabilitySchema = z
  .object({
    startTime: z.date(),
    endTime: z.date(),
    duration: z
      .string()
      .min(1)
      .refine((val) => !isNaN(Number(val)), {
        message: "Only numbers allowed",
      }),
    recurring: z.boolean(),
    mon: z.boolean(),
    tue: z.boolean(),
    wed: z.boolean(),
    thu: z.boolean(),
    fri: z.boolean(),
    sat: z.boolean(),
    sun: z.boolean(),
    endDate: z.date(),
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
  });
export type AvailabilityData = z.infer<typeof availabilitySchema>;
