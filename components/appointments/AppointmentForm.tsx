"use client";

import SearchField, { SearchFieldOptions } from "@/components/forms/SearchField";
import SubmitButton from "@/components/forms/SubmitButton";
import ErrorCard from "@/components/shared/ErrorCard";
import { Form } from "@/components/ui/form";
import { listPatientsForSearch } from "@/server/actions/listPatientsForSearch";
import { appointmentsSchema } from "@/server/adapters/zod/appointmentValidator";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  PatientNamePhone,
  PatientsIndexedByName,
} from "@/server/domain/models/patientIndexedByName";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import { SelectedField } from "@/components/forms/SelectedField";

const appointmentFormSchema = z.object({
  patientSearch: z.string(),
  patientId: z.string(),
  doctorId: z.string(),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export function AppointmentForm({ appointment: ap }: { appointment: AppointmentHydrated }) {
  const [patient, setPatient] = useState<PatientNamePhone>(ap.patient);
  const [patients, setPatients] = useState<PatientsIndexedByName | "error">();
  const [matchingPatients, setMatchingPatients] = useState<SearchFieldOptions[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientSearch: "",
    },
  });

  const patientsLoading = !patients;
  const patientsError = patients === "error";
  const patientSearch = form.watch("patientSearch");

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

      console.log("🚀 ~ result:", result);

      setMatchingPatients(result);
    },
    [patients, patientsLoading, patientsError],
  );

  useEffect(() => {
    searchPatient(patientSearch);
  }, [patientSearch, searchPatient]);

  async function loadPatients() {
    const patientsResult = await listPatientsForSearch();
    if (!patientsResult.ok) {
      setPatients("error");
      return;
    }

    setPatients(patientsResult.value);
  }

  useEffect(() => {
    loadPatients();
  }, []);

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
        </div>

        {/* <TextField form={form} label="DoctorId" name="doctorId" />
        <DateField form={form} label="startTime" name="startTime" placeholder="Pick a date" /> */}
        {/* <DurationField form={form} name="duration" label="Duration" /> */}
        <SubmitButton form={form} label="Save" />
      </form>
    </Form>
  );
}
