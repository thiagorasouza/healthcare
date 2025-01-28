import { GenericValidator } from "@/server/adapters/zod/genericValidator";
import { weekdays } from "@/server/config/constants";
import { CreatePatternRequest } from "@/server/useCases/createPattern/createPatternUseCase";
import { UpdatePatternRequest } from "@/server/useCases/updatePattern/updatePatternUseCase";
import { differenceInMonths } from "date-fns";
import { z } from "zod";

export const patternDefaultValues = {
  startDate: undefined,
  endDate: undefined,
  startTime: undefined,
  endTime: undefined,
  duration: 0,
  recurring: false,
  weekdays: [],
  doctorId: undefined,
};

const isMultipleOf = (num: number, divisor: number) => num % divisor === 0;

const defaultCoercedDate = z.coerce.date({
  errorMap: (issue, { defaultError }) => ({
    message: issue.code === "invalid_date" ? "Required" : defaultError,
  }),
});

const patternFormSchemaBase = z.object({
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
  doctorId: z.string(),
});

export type PatternFormData = z.infer<typeof patternFormSchemaBase>;

export const updatePatternSchemaBase = patternFormSchemaBase.extend({
  id: z.string(),
});

export type UpdatePatternData = z.infer<typeof updatePatternSchemaBase>;

const refinePatternSchema = (schema: typeof patternFormSchemaBase) =>
  schema
    .refine(
      ({ recurring, weekdays: weekdaysInput }) => {
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
      if (differenceInMonths(endDate, startDate) > 6) {
        ctx.addIssue({
          code: "custom",
          message: "Max of 6 months ahead",
          path: ["endDate"],
        });
      }
    });

export const patternFormSchema = refinePatternSchema(patternFormSchemaBase);
export const updatePatternSchema = refinePatternSchema(updatePatternSchemaBase);

export const createPatternValidator = new GenericValidator<CreatePatternRequest>(patternFormSchema);
export const updatePatternValidator = new GenericValidator<UpdatePatternRequest>(
  updatePatternSchema,
);
