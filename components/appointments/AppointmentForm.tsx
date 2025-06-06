"use client";

import SubmitButton from "@/components/forms/SubmitButton";
import { Form } from "@/components/ui/form";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import DateField from "@/components/forms/DateField";
import { addMinutes } from "date-fns";
import { getHoursStr, joinDateTime, setToMidnightUTC } from "@/server/useCases/shared/helpers/date";
import HoursField from "@/components/forms/HoursField";
import { updateAppointment } from "@/server/actions/updateAppointment";
import { ErrorDialog } from "@/components/shared/ErrorDialog";
import { displayError } from "@/server/config/errors";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SearchAndSelectField } from "@/components/forms/SearchAndSelectField";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { listDoctors } from "@/server/actions/listDoctors.bypass";
import { PatientModel } from "@/server/domain/models/patientModel";
import { listPatients } from "@/server/actions/listPatients.bypass";
import { createAppointment } from "@/server/actions/createAppointment";

const appointmentFormSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  duration: z.number(),
  date: z.coerce.date(),
  hour: z.string().length(5, "Please select an hour"),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export interface CreateAppointmentFormProps {
  mode: "create";
  appointment?: undefined;
}

export interface UpdateAppointmentFormProps {
  mode: "update";
  appointment: AppointmentHydrated;
}

export function AppointmentForm({
  mode,
  appointment,
}: CreateAppointmentFormProps | UpdateAppointmentFormProps) {
  const [message, setMessage] = useState("");
  const [slots, setSlots] = useState<SlotsModel | "error">();
  const [doctors, setDoctors] = useState<DoctorModel[] | "error">();
  const [patients, setPatients] = useState<PatientModel[] | "error">();
  const router = useRouter();

  // console.log("🚀 ~ appointment:", appointment);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: appointment?.patient.id || "",
      doctorId: appointment?.doctor.id || "",
      duration: appointment ? Number(appointment?.duration) : 0,
      date: appointment ? appointment?.startTime : setToMidnightUTC(new Date()),
      hour: appointment ? getHoursStr(appointment?.startTime) : "00:00",
    },
  });

  async function loadAvailableSlots(
    doctorId: string,
    appointment?: { startTime: Date; duration: number },
  ) {
    try {
      const slotsResult = await getSlots(
        objectToFormData({
          doctorId,
          startDate: new Date(),
        }),
      );
      if (!slotsResult.ok) throw slotsResult.error;

      const slots = slotsResult.value;

      // add current slot
      if (appointment) {
        const dateStr = setToMidnightUTC(appointment.startTime).toISOString();
        const startHour = getHoursStr(appointment.startTime);
        const endHour = getHoursStr(addMinutes(appointment.startTime, appointment.duration));
        const allSlots = slots.set(
          dateStr,
          (slots.get(dateStr) || []).concat([[startHour, endHour]]).sort(),
        );
        setSlots(allSlots);
      } else {
        setSlots(slots);
      }
    } catch (error) {
      console.log(error);
      setMessage("Unable to load doctor slots");
    }
  }

  const slotsLoading = !slots;
  const slotsError = slots === "error";

  const doctorId = form.watch("doctorId");

  useEffect(() => {
    if (doctorId) {
      loadAvailableSlots(doctorId, appointment);
    }
  }, [doctorId, appointment]);

  const dates = useMemo(() => {
    if (slotsLoading || slotsError) return [];
    return [...slots.keys()].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [slots, slotsError, slotsLoading]);

  const selectedDate = form.watch("date");
  // console.log("🚀 ~ selectedDate:", selectedDate);

  const hours = useMemo(() => {
    const dateStr = setToMidnightUTC(selectedDate).toISOString();
    if (slotsLoading || slotsError || !slots.has(dateStr)) return [];

    const hours = slots.get(dateStr) as string[][];

    return hours;
  }, [selectedDate, slotsLoading, slotsError, slots]);
  // console.log("🚀 ~ hours ~ hours:", hours);

  async function loadDoctors() {
    try {
      const doctorsResult = await listDoctors();
      if (!doctorsResult.ok) throw doctorsResult.error;

      const doctors = doctorsResult.value;
      setDoctors(doctors);
    } catch (error) {
      console.log(error);
      setMessage("Unable to load doctors.");
    }
  }

  async function loadPatients() {
    try {
      const patientsResult = await listPatients();
      if (!patientsResult.ok) throw patientsResult.error;

      const patients = patientsResult.value;
      setPatients(patients);
    } catch (error) {
      console.log(error);
      setMessage("Unable to load patients.");
    }
  }

  useEffect(() => {
    loadDoctors();
    loadPatients();
  }, []);

  async function onSubmit(data: AppointmentFormData) {
    if (slotsLoading || slotsError) return;

    const dateStr = data.date.toISOString();
    const formData = objectToFormData({
      patientId: data.patientId,
      doctorId: data.doctorId,
      startTime: joinDateTime(dateStr, data.hour),
      duration: data.duration,
    });

    try {
      if (mode === "update") {
        formData.append("id", appointment.id);
        const updateResult = await updateAppointment(formData);
        if (!updateResult.ok) {
          setMessage(displayError(updateResult));
          return;
        }
        toast("Appointment saved.");
      } else if (mode === "create") {
        const createResult = await createAppointment(formData);
        if (!createResult.ok) {
          setMessage(displayError(createResult));
          return;
        }
        toast("Appointment created.");
      }

      router.push("/admin");
    } catch (error) {
      console.log(error);
      setMessage(displayError());
    }
  }

  return (
    <>
      <ErrorDialog message={message} setMessage={setMessage}></ErrorDialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
          className="flex flex-col gap-3 md:gap-6"
        >
          <SearchAndSelectField
            form={form}
            name="patientId"
            label="Patient"
            defaultValue={appointment?.patient}
            entities={patients !== "error" ? patients : undefined}
            parameter="name"
            makeText={(patient: PatientModel) => `${patient.name} | ${patient.phone}`}
            makeLink={(patient: PatientModel) => `/admin/patients/${patient.id}`}
          />
          <SearchAndSelectField
            form={form}
            name="doctorId"
            label="Doctor"
            defaultValue={appointment?.doctor}
            entities={doctors !== "error" ? doctors : undefined}
            parameter="name"
            makeText={(doctor: DoctorModel) => `${doctor.name} | ${doctor.specialty}`}
            makeLink={(doctor: DoctorModel) => `/admin/doctors/${doctor.id}`}
          />
          <DateField
            form={form}
            name="date"
            label="Date"
            placeholder="Pick a date"
            side="top"
            type="future"
            {...(dates.length > 0
              ? {
                  startMonth: new Date(dates[0]),
                  endMonth: new Date(dates[dates.length - 1]),
                  disabledFn: (date) => !dates.includes(setToMidnightUTC(date).toISOString()),
                }
              : { disabledFn: () => true })}
          />
          <HoursField
            form={form}
            name="hour"
            label="Hours"
            loading={slotsLoading}
            hours={hours}
            placeholder="No slots available for this date"
          />
          <SubmitButton form={form} label="Save" />
        </form>
      </Form>
    </>
  );
}
