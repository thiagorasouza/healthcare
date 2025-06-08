"use client";

import LoadingPage from "@/app/loading";
import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { ErrorScreen } from "@/components/shared/ErrorScreen";
import RestartTour from "@/components/shared/RestartTour";
import { getTourState } from "@/lib/actions/localStorage";
import { ReducerContext } from "@/lib/context/reducerContext";
import { listDoctors } from "@/server/actions/listDoctors.bypass";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useNextStep } from "nextstepjs";
import { useContext, useEffect, useState } from "react";

export default function BookingPage() {
  const [doctors, setDoctors] = useState<DoctorModel[] | "error">();
  const { state, dispatch } = useContext(ReducerContext);
  const { startNextStep } = useNextStep();

  // @estlint
  useEffect(() => {
    async function loadDoctors() {
      try {
        const doctorsResult = await listDoctors();
        if (!doctorsResult.ok) {
          setDoctors("error");
          return;
        }

        setDoctors(doctorsResult.value);
      } catch (error) {
        console.log(error);
        setDoctors("error");
      }
    }

    loadDoctors();
    const tourState = getTourState();
    if (tourState === "show") {
      startNextStep("bookingTour");
    }
  }, []);

  if (!doctors) {
    return <LoadingPage fullScreen={false} />;
  } else if (doctors === "error") {
    return (
      <ErrorScreen
        title="Server Error"
        message="It looks like the server couldn't fetch the information required to load this page. Please try again."
      />
    );
  } else if (doctors.length === 0) {
    return (
      <ErrorScreen title="Error" message="Sorry, there are no doctors available." refresh={false} />
    );
  } else {
    return (
      <>
        <RestartTour />
        <AppointmentCreator doctors={doctors} state={state} dispatch={dispatch} />
      </>
    );
  }
}
