import { PatternData } from "@/lib/schemas/patternsSchema";
import { getMinutesSinceMidnight } from "@/lib/utils";
import { Weekday } from "@/server/domain/models/patternModel";
import { areIntervalsOverlapping } from "date-fns";

export class Pattern {
  private data: PatternData;

  public constructor(data: PatternData) {
    this.data = data;
  }

  public get() {
    return this.data;
  }

  public isConflicting(newPattern: PatternData) {
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

    if (this.data.recurring && newPattern.recurring) {
      const conflictingWeekdays = this.data.weekdays.filter((weekday) =>
        newPattern.weekdays.includes(weekday),
      ) as Weekday[];

      if (!conflictingWeekdays) {
        return false;
      }
    }

    return areDatesOverlapping() && areTimesOverlapping();
  }
}
