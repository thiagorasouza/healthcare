import { DependencyList, useCallback } from "react";
import lodashDebounce from "lodash.debounce";

const DEBOUNCE_DELAY = 200;

export function useDebouncedCallback(callback: (...args: any) => any, deps: DependencyList) {
  return useCallback(lodashDebounce(callback, DEBOUNCE_DELAY), deps);
}
