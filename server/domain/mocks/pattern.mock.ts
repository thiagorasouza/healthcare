import { weekdays } from "@/server/config/constants";
import { faker } from "@faker-js/faker";
import { addHours, addWeeks } from "date-fns";

export const mockPattern = () => {
  const startDate = faker.date.soon();

  return {
    id: faker.string.uuid(),
    startDate,
    endDate: addWeeks(startDate, 1),
    startTime: startDate,
    endTime: addHours(startDate, 3),
    duration: 30,
    recurring: faker.datatype.boolean(),
    weekdays: faker.helpers.arrayElements(weekdays, 2),
    doctorId: faker.string.uuid(),
  };
};
