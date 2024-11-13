import { PatientParsedData } from "@/lib/schemas/patientsSchema";
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

export type State =
  | {
      phase: "doctor_selection";
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
      slot: { date: string; hour?: string; duration?: number };
    }
  | {
      phase: "patient_creation";
      doctor: DoctorModel;
      slots: SlotsModel;
      slot: { date: string; hour: string; duration: number };
    }
  | {
      phase: "summary";
      doctor: DoctorModel;
      patient: PatientParsedData;
      slots: SlotsModel;
      slot: { date: string; hour: string; duration: number };
    }
  | {
      phase: "confirmation";
      doctor: DoctorModel;
      patient: PatientParsedData;
      slots: SlotsModel;
      slot: { date: string; hour: string; duration: number };
    };

export type Action =
  | { type: "remove_doctor" }
  | { type: "set_doctor"; payload: { doctor: DoctorModel; slots: SlotsModel } }
  | { type: "set_date"; payload: { date: string } }
  | { type: "set_hour_duration"; payload: { hour: string; duration: number } }
  | { type: "show_patient_form" }
  | { type: "change_slot" }
  | { type: "show_summary"; payload: { patient: PatientParsedData } }
  | { type: "show_confirmation" };

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
    case "set_date":
      if (state.phase !== "date_selection" && state.phase !== "hour_selection") {
        throw new Error("Invalid application flow.");
      }
      return {
        ...state,
        phase: "hour_selection",
        doctor: state.doctor,
        slot: { date: action.payload.date, hour: undefined, duration: undefined },
      };
    case "set_hour_duration":
      if (state.phase !== "hour_selection" && state.phase !== "patient_creation") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "patient_creation",
        slot: {
          date: state.slot.date,
          hour: action.payload.hour,
          duration: action.payload.duration,
        },
      };
    case "change_slot":
      if (state.phase !== "patient_creation") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "hour_selection",
      };
    case "show_summary": {
      if (state.phase !== "patient_creation") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "summary",
        patient: action.payload.patient,
      };
    }
    case "show_confirmation": {
      if (state.phase !== "summary") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "confirmation",
      };
    }
    default:
      throw new Error("Invalid reducer dispatch.");
  }
}
