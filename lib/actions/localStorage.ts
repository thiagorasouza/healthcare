export interface AppointmentPublicData {
  id: string;
  patient: {
    name: string;
  };
  doctor: {
    name: string;
    specialty: string;
    pictureId: string;
  };
  date: string;
  hour: string;
  duration: number;
}

type TourState = "show" | "hide";

export function getTourState(): TourState {
  try {
    const tourState = localStorage.getItem("tourState");
    return tourState === "hide" ? tourState : "show";
  } catch (error) {
    console.log(error);
    return "show";
  }
}

export function setTourState(tourState: TourState) {
  try {
    localStorage.setItem("tourState", tourState);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function saveAppointmentLS(newData: AppointmentPublicData) {
  try {
    const localData = getAppointmentsLS();
    localData.push(newData);
    localStorage.setItem("appointments", JSON.stringify(localData));
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export function getAppointmentsLS(): AppointmentPublicData[] {
  try {
    const localDataStr = localStorage.getItem("appointments");
    const localData = localDataStr !== null ? JSON.parse(localDataStr) : [];
    if (!Array.isArray(localData)) throw new Error("Invalid local data");
    return localData;
  } catch (error) {
    console.log(error);
    return [];
  }
}
