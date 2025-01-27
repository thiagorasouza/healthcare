import { Action, State } from "@/components/appointments/AppointmentCreatorReducer";
import { createContext, Dispatch } from "react";

export interface ReducerContextType {
  state: State;
  dispatch: Dispatch<Action>;
}

// @ts-ignore
export const ReducerContext = createContext<ReducerContextType>(null);
