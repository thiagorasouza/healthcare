import { z } from "zod";

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
  });
export type AvailabilityData = z.infer<typeof availabilitySchema>;

export function getRawAvailabilityData(formData: FormData) {
  return {
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    duration: formData.get("duration"),
    doctorId: formData.get("doctorId"),
  };
}
