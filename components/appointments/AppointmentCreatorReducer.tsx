import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatientData } from "@/server/domain/models/patientData";
import { PatientModel } from "@/server/domain/models/patientModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";

export const initialState: State = {
  phase: "doctor_selection",
};

export type State =
  | {
      phase: "doctor_selection";
      doctor?: DoctorModel;
      slots?: SlotsModel;
      patientFormSave?: PatientData;
      patient?: PatientModel;
      slot?: { date?: string; hour?: string; duration?: number };
    }
  | {
      phase: "date_selection";
      doctor: DoctorModel;
      slots: SlotsModel;
      patientFormSave?: PatientData;
      patient?: PatientModel;
      slot?: { date?: string; hour?: string; duration?: number };
    }
  | {
      phase: "hour_selection";
      doctor: DoctorModel;
      slots: SlotsModel;
      patientFormSave?: PatientData;
      patient?: PatientModel;
      slot: { date: string; hour?: string; duration?: number };
    }
  | {
      phase: "patient_creation";
      doctor: DoctorModel;
      slots: SlotsModel;
      patientFormSave?: PatientData;
      patient?: PatientModel;
      slot: { date: string; hour: string; duration: number };
    }
  | {
      phase: "summary";
      doctor: DoctorModel;
      slots: SlotsModel;
      patientFormSave?: PatientData;
      patient: PatientModel;
      slot: { date: string; hour: string; duration: number };
    }
  | {
      phase: "confirmation";
      doctor: DoctorModel;
      slots: SlotsModel;
      patientFormSave?: PatientData;
      patient: PatientModel;
      slot: { date: string; hour: string; duration: number };
      appointmentId: string;
    };

export type Action =
  | { type: "remove_doctor" }
  | { type: "set_doctor"; payload: { doctor: DoctorModel; slots: SlotsModel } }
  | { type: "set_date"; payload: { date: string } }
  | { type: "set_hour_duration"; payload: { hour: string; duration: number } }
  | { type: "back_to_hour_selection"; payload: { patientFormSave: PatientData } }
  | { type: "set_patient_form_save"; payload: { patientFormSave: PatientData } }
  | { type: "back_to_patient_creation" }
  | { type: "show_summary"; payload: { patient: PatientModel } }
  | { type: "show_confirmation"; payload: { appointmentId: string } };

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "remove_doctor":
      if (
        state.phase !== "doctor_selection" &&
        state.phase !== "date_selection" &&
        state.phase !== "hour_selection"
      ) {
        throw new Error("Invalid application flow.");
      }
      return initialState;
    case "set_doctor":
      return {
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
        slot: { date: action.payload.date },
      };
    case "set_hour_duration":
      if (state.phase !== "hour_selection" && state.phase !== "patient_creation") {
        throw new Error("Invalid application flow.");
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
    case "back_to_hour_selection":
      if (state.phase !== "patient_creation") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "hour_selection",
      };
    case "set_patient_form_save":
      if (state.phase !== "patient_creation") {
        throw new Error("Invalid applcation flow.");
      }
      console.log("set_patient_form_save");
      return { ...state };
    case "back_to_patient_creation":
      if (state.phase !== "summary") {
        throw new Error("Invalid applcation flow.");
      }
      return {
        ...state,
        phase: "patient_creation",
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
        appointmentId: action.payload.appointmentId,
      };
    }
    default:
      throw new Error("Invalid reducer dispatch.");
  }
}
