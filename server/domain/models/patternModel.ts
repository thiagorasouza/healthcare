export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface PatternModel {
  id: string;
  startDate: Date;
  endDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number;
  recurring: boolean;
  weekdays: Weekday[];
  doctorId: string;
}
