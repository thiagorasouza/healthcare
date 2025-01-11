"use client";

import SubmitButton from "@/components/forms/SubmitButton";
import { Form } from "@/components/ui/form";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SelectedField } from "@/components/forms/SelectedField";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import DateField from "@/components/forms/DateField";
import { addMinutes, startOfDay } from "date-fns";
import { getHoursStr, joinDateTime } from "@/server/useCases/shared/helpers/date";
import HoursField from "@/components/forms/HoursField";
import { updateAppointment } from "@/server/actions/updateAppointment";
import { SelectPatientField } from "@/components/forms/SelectPatientField";

const appointmentFormSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  duration: z.number(),
  date: z.coerce.date(),
  hour: z.string().length(5, "Please select an hour"),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export function AppointmentForm({ appointment: ap }: { appointment: AppointmentHydrated }) {
  const [slots, setSlots] = useState<SlotsModel | "error">();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: ap.patient.id,
      doctorId: ap.doctor.id,
      duration: Number(ap.duration),
      date: startOfDay(ap.startTime),
      hour: getHoursStr(ap.startTime),
    },
  });

  async function loadSlots() {
    try {
      const slotsResult = await getSlots(
        objectToFormData({
          doctorId: ap.doctor.id,
          startDate: new Date(),
        }),
      );
      if (!slotsResult.ok) throw slotsResult.error;

      const slots = slotsResult.value;

      // add current slot
      const dateStr = form.getValues("date").toISOString();
      const startHour = form.getValues("hour");
      const endHour = getHoursStr(addMinutes(joinDateTime(dateStr, startHour), ap.duration));
      const allSlots = slots.set(
        dateStr,
        (slots.get(dateStr) || []).concat([[startHour, endHour]]).sort(),
      );

      setSlots(allSlots);
    } catch (error) {}
  }

  const slotsLoading = !slots;
  const slotsError = slots === "error";

  const dates = useMemo(() => {
    if (slotsLoading || slotsError) return [];
    return [...slots.keys()];
  }, [slots, slotsError, slotsLoading]);

  const selectedDate = form.watch("date");

  const hours = useMemo(() => {
    const dateStr = selectedDate.toISOString();
    if (slotsLoading || slotsError || !slots.has(dateStr)) return [];

    const hours = slots.get(dateStr) as string[][];

    return hours;
  }, [selectedDate, slotsLoading, slotsError, slots]);

  const selectedHour = form.watch("hour");

  useEffect(() => {
    loadSlots();
  }, []);

  async function onSubmit(data: AppointmentFormData) {
    // console.log("🚀 ~ data:", data);
    // return;
    const startTime = joinDateTime(data.date.toISOString(), data.hour);

    const formData = objectToFormData({
      id: ap.id,
      patientId: data.patientId,
      doctorId: data.doctorId,
      startTime,
      duration: data.duration,
    });
    try {
      const updateResult = await updateAppointment(formData);
      console.log("🚀 ~ updateResult:", updateResult);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="flex flex-col gap-3 md:gap-6"
      >
        <SelectPatientField
          form={form}
          label="Patient"
          defaultValue={ap.patient}
          description="You can select another patient for this appointment"
        />
        <SelectedField
          form={form}
          name="doctorId"
          value={ap.doctor.id}
          label="Doctor"
          description="To change the doctor, please delete this and create a new appointment"
          placeholder={`${ap.doctor.name} | ${ap.doctor.specialty}`}
          link={`/admin/doctors/${ap.doctor.id}`}
          loading={false}
        />
        <DateField
          form={form}
          name="date"
          label="Date"
          placeholder="Pick a date"
          {...(dates.length > 0
            ? {
                startMonth: new Date(dates[0]),
                endMonth: new Date(dates[dates.length - 1]),
                disabledFn: (date) => !dates.includes(date.toISOString()),
              }
            : { disabledFn: () => true })}
        />
        <HoursField
          form={form}
          name="hour"
          label="Hours"
          loading={slotsLoading}
          hours={hours}
          placeholder="Loading..."
        />

        <SubmitButton form={form} label="Save" />
      </form>
    </Form>
  );
}
