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
