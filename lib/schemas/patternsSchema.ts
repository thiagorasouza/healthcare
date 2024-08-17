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

const defaultCoercedDate = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message: issue.code === "invalid_date" ? "Required" : defaultError,
  }),
});

export const patternSchema = z
  .object({
    startDate: defaultCoercedDate,
    endDate: defaultCoercedDate,
    startTime: defaultCoercedDate,
    endTime: defaultCoercedDate,
    duration: z.coerce.number().min(15, {
      message: "At least 15 minutes",
    }),
    recurring: z.preprocess((val) => {
      if (typeof val === "boolean") {
        return val;
      } else {
        return typeof val === "string" && val.toLowerCase() === "true";
      }
    }, z.boolean()),
    // [] | Weekday[] if recurring = false
    weekdays: z.preprocess(
      (val) => (typeof val === "string" ? val.split(",") : val),
      z.array(z.string()),
    ),
  })
  .refine(
    ({ recurring, weekdays: weekdaysInput }) => {
      // console.log("🚀 ~ weekdaysInput:", weekdaysInput);
      if (!recurring) return true;
      return (
        Array.isArray(weekdaysInput) &&
        weekdaysInput.length > 0 &&
        weekdaysInput?.every((item: any) => weekdays.includes(item))
      );
    },
    {
      message: "Required for a recurring pattern",
      path: ["weekdays"],
    },
  )
  .superRefine(({ startTime, endTime }, ctx) => {
    if (startTime >= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Must be before end time",
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
        message: "Must be a multiple of the available hours",
        path: ["duration"],
      });
    }
  })
  .superRefine(({ startTime, endTime, endDate, recurring }, ctx) => {
    if (!recurring) return;
    if (endDate <= startTime || endDate <= endTime) {
      ctx.addIssue({
        code: "custom",
        message: "Should be after start date",
        path: ["endDate"],
      });
    }
  })
  .superRefine(({ startDate, endDate, recurring }, ctx) => {
    if (!recurring) return;
    if (differenceInMonths(endDate, startDate) > 3) {
      ctx.addIssue({
        code: "custom",
        message: "Max of 3 months ahead",
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
