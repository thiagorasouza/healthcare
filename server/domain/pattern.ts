import { getMinutesSinceMidnight } from "@/lib/utils";
import { PatternFormData } from "@/server/adapters/zod/patternValidator";
import { Weekday } from "@/server/domain/models/patternModel";
import { getWeekday } from "@/server/useCases/shared/helpers/date";
import { areIntervalsOverlapping } from "date-fns";

export class Pattern {
  private data: PatternFormData;

  public constructor(data: PatternFormData) {
    this.data = data;
  }

  public get() {
    return this.data;
  }

  public isConflicting(newPattern: PatternFormData) {
    const areDatesOverlapping = () => {
      return areIntervalsOverlapping(
        { start: this.data.startDate, end: this.data.endDate },
        { start: newPattern.startDate, end: newPattern.endDate },
        { inclusive: true },
      );
    };

    const areTimesOverlapping = () => {
      const currStartMins = getMinutesSinceMidnight(this.data.startTime);
      const currEndMins = getMinutesSinceMidnight(this.data.endTime);
      const newStartMins = getMinutesSinceMidnight(newPattern.startTime);
      const newEndMins = getMinutesSinceMidnight(newPattern.endTime);
      if (currStartMins >= newStartMins && currStartMins < newEndMins) {
        return true;
      }
      if (currEndMins > newStartMins && currEndMins <= newEndMins) {
        return true;
      }
      return false;
    };

    const currentWeekdays = this.getWeekdaysArray(this.data);
    const newWeekdays = this.getWeekdaysArray(newPattern);

    const conflictingWeekdays = currentWeekdays.filter((weekday) =>
      newWeekdays.includes(weekday),
    ) as Weekday[];

    if (conflictingWeekdays.length === 0) {
      return false;
    }

    return areDatesOverlapping() && areTimesOverlapping();
  }

  protected getWeekdaysArray(pattern: PatternFormData) {
    return pattern.recurring ? pattern.weekdays : [getWeekday(pattern.startDate)];
  }
}
