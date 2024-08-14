export function countSlotsInTimespan(startTime: Date, endTime: Date, durationMin: number) {
  const startTimeMs = startTime.getTime();
  const endTimeMs = endTime.getTime();
  const diffMs = endTimeMs - startTimeMs;
  const durationMs = durationMin * 60 * 1000;
  const slotsNum = diffMs / durationMs;

  return slotsNum;
}
