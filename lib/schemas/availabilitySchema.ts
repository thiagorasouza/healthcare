import { z } from "zod";

export const availabilitySchema = z.object({
  startTime: z.date(),
  endTime: z.date(),
  duration: z.string(),
});

export type AvailabilityData = z.infer<typeof availabilitySchema>;
