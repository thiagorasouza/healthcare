export function isSlotPossible(slotsList: Date[][], startTime: Date) {
  return slotsList.some((slot) => slot[0].getTime() === startTime.getTime());
}
