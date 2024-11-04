import { DoctorModel } from "@/server/domain/models/doctorModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";

const undefinedProps = {
  doctor: undefined,
  slots: undefined,
  slot: { date: undefined, hour: undefined, duration: undefined },
};

export const initialState: State = {
  ...undefinedProps,
  phase: "doctor_selection",
};

type State =
  | {
      phase: "doctor_selection";
      doctor: undefined;
      slots: undefined;
      slot: { date: undefined; hour: undefined; duration: undefined };
    }
  | {
      phase: "slots_error";
      doctor: undefined;
      slots: undefined;
      slot: { date: undefined; hour: undefined; duration: undefined };
    }
  | {
      phase: "date_selection";
      doctor: DoctorModel;
      slots: SlotsModel;
      slot: { date: undefined; hour: undefined; duration: undefined };
    }
  | {
      phase: "hour_selection";
      doctor: DoctorModel;
      slots: SlotsModel;
      slot: { date: string; hour: undefined; duration: undefined };
    }
  | {
      phase: "summary";
      doctor: DoctorModel;
      slots: SlotsModel;
      slot: { date: string; hour: string; duration: number };
    };

type Action =
  | { type: "remove_doctor" }
  | { type: "set_doctor"; payload: { doctor: DoctorModel; slots: SlotsModel } }
  | { type: "slots_error" }
  | { type: "set_date"; payload: { date: string } }
  | { type: "set_hour_duration"; payload: { hour: string; duration: number } };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "remove_doctor":
      return {
        ...undefinedProps,
        phase: "doctor_selection",
      };
    case "set_doctor":
      return {
        ...undefinedProps,
        phase: "date_selection",
        doctor: action.payload.doctor,
        slots: action.payload.slots,
      };
    case "slots_error":
      return {
        ...undefinedProps,
        phase: "slots_error",
      };
    case "set_date":
      if (state.phase !== "date_selection") throw new Error("Invalid applcation flow.");
      return {
        ...state,
        phase: "hour_selection",
        slot: { date: action.payload.date, hour: undefined, duration: undefined },
      };
    case "set_hour_duration":
      if (state.phase !== "hour_selection") throw new Error("Invalid applcation flow.");
      return {
        ...state,
        phase: "summary",
        slot: {
          date: state.slot.date,
          hour: action.payload.hour,
          duration: action.payload.duration,
        },
      };
    default:
      throw new Error("Invalid reducer dispatch.");
  }
}
