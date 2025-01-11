"use client";

import SearchField, { SearchFieldOptions } from "@/components/forms/SearchField";
import SubmitButton from "@/components/forms/SubmitButton";
import ErrorCard from "@/components/shared/ErrorCard";
import { Form } from "@/components/ui/form";
import { listPatientsForSearch } from "@/server/actions/listPatientsForSearch";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  PatientNamePhone,
  PatientsIndexedByName,
} from "@/server/domain/models/patientIndexedByName";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import { SelectedField } from "@/components/forms/SelectedField";
import { getSlots } from "@/server/actions/getSlots";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import DateField from "@/components/forms/DateField";
import { addMinutes, startOfDay } from "date-fns";
import { getHoursStr, joinDateTime } from "@/server/useCases/shared/helpers/date";
import HoursField from "@/components/forms/HoursField";

const appointmentFormSchema = z.object({
  patientSearch: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
  date: z.coerce.date(),
  hour: z.string().length(5, "Please select an hour"),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export function AppointmentForm({ appointment: ap }: { appointment: AppointmentHydrated }) {
  const [patient, setPatient] = useState<PatientNamePhone>(ap.patient);
  const [slots, setSlots] = useState<SlotsModel | "error">();
  const [patients, setPatients] = useState<PatientsIndexedByName | "error">();
  const [matchingPatients, setMatchingPatients] = useState<SearchFieldOptions[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientSearch: "",
      patientId: "",
      doctorId: "",
      date: startOfDay(ap.startTime),
      hour: getHoursStr(ap.startTime),
    },
  });

  async function loadPatients() {
    try {
      const patientsResult = await listPatientsForSearch();
      if (!patientsResult.ok) throw patientsResult.error;

      setPatients(patientsResult.value);
    } catch (error) {
      console.log(error);
      setPatients("error");
    }
  }

  const patientsLoading = !patients;
  const patientsError = patients === "error";
  const patientSearch = form.watch("patientSearch");

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

  // console.log("🚀 ~ startTime:", startTime);

  const selectedDate = form.watch("date");

  const hours = useMemo(() => {
    const dateStr = selectedDate.toISOString();
    if (slotsLoading || slotsError || !slots.has(dateStr)) return [];

    const hours = slots.get(dateStr) as string[][];

    return hours;
  }, [selectedDate, slotsLoading, slotsError, slots]);

  const selectedHour = form.watch("hour");
  console.log("🚀 ~ selectedHour:", selectedHour);

  // useEffect(() => {
  //   const hasCurrentHour = !hours.some(([hour]) => hour[0] === selectedHour);
  //   console.log("🚀 ~ hasCurrentHour:", hasCurrentHour);
  //   if (!hasCurrentHour) {
  //     form.setValue("hour", "");
  //   }
  // }, [selectedHour, hours, form]);

  useEffect(() => {
    loadPatients();
    loadSlots();
  }, []);

  const searchPatient = useDebouncedCallback(
    (searchTerm: string) => {
      if (patientsLoading || patientsError || searchTerm.length === 0) {
        setMatchingPatients([]);
        return;
      }

      const result: SearchFieldOptions[] = [];

      for (const patientName in patients) {
        const patientExists = patientName.toLowerCase().includes(searchTerm.toLowerCase());
        if (patientExists) {
          const patient = patients[patientName];
          result.push({
            value: patient.name,
            label: `${patient.name} | ${patient.phone}`,
          });
        }
      }

      // console.log("🚀 ~ result:", result);

      setMatchingPatients(result);
    },
    [patients, patientsLoading, patientsError],
  );

  useEffect(() => {
    searchPatient(patientSearch);
  }, [patientSearch, searchPatient]);

  function onPatientSelect(patientName: string) {
    console.log("🚀 ~ patientName:", patientName);
    if (patientsError || patientsLoading) return;
    const newPatient = patients[patientName];
    console.log("🚀 ~ newPatient:", newPatient);
    setPatient(newPatient);
  }

  async function onSubmit(formData: AppointmentFormData) {
    console.log("🚀 ~ formData:", formData);
  }

  if (patientsError) {
    return <ErrorCard refresh={true} text="There was an error while trying to load patients" />;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="flex flex-col gap-3 md:gap-6"
      >
        <div className="space-y-2">
          <SelectedField
            form={form}
            name="patientId"
            value={patient.id}
            label="Patient"
            placeholder={`${patient.name} | ${patient.phone}`}
            link={`/admin/patients/${patient.id}`}
            loading={patientsLoading}
          />
          <SearchField
            form={form}
            name="patientSearch"
            description="You can select another patient for this appointment"
            disabled={patientsLoading}
            placeholder={
              patientsLoading ? "Please wait for a few seconds..." : "Type the new patient's name"
            }
            options={matchingPatients}
            onSelect={onPatientSelect}
          />
        </div>
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
        <div className="flex gap-3">
          <p className="">Summary</p>
        </div>

        {/* <TextField form={form} label="DoctorId" name="doctorId" />
        <DateField form={form} label="startTime" name="startTime" placeholder="Pick a date" /> */}
        {/* <DurationField form={form} name="duration" label="Duration" /> */}
        <SubmitButton form={form} label="Save" />
      </form>
    </Form>
  );
}
