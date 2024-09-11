import { error, invalidFieldsError, success } from "@/lib/results";
import { getInvalidFieldsList } from "@/lib/utils";
import { ZodSchema } from "zod";

export function validateWithZod<T>(zodSchema: ZodSchema<T>, rawData: any) {
  const validation = zodSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldsList = getInvalidFieldsList(validation);
    return invalidFieldsError(fieldsList);
  }

  return success<T>(validation.data);
}
