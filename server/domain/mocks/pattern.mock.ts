import { PatternModel } from "@/server/domain/models/patternModel";
import { faker } from "@faker-js/faker";
import { addMonths } from "date-fns";

export const mockPattern = (): PatternModel => {
  return {
    id: faker.string.uuid(),
    startDate: new Date(),
    endDate: addMonths(new Date(), 3),
    startTime: new Date(new Date().setHours(8, 0, 0, 0)),
    endTime: new Date(new Date().setHours(16, 0, 0, 0)),
    duration: 30,
    recurring: true,
    weekdays: ["tue", "wed", "thu"],
    doctorId: faker.string.uuid(),
  };
};
