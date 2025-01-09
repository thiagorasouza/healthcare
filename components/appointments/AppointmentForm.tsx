"use client";

import SearchField, { SearchFieldOptions } from "@/components/forms/SearchField";
import SubmitButton from "@/components/forms/SubmitButton";
import ErrorCard from "@/components/shared/ErrorCard";
import { Form } from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { listPatientsForSearch } from "@/server/actions/listPatientsForSearch";
import { appointmentsSchema } from "@/server/adapters/zod/appointmentValidator";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import {
  PatientNamePhone,
  PatientsIndexedByName,
} from "@/server/domain/models/patientIndexedByName";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, UserIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";

const appointmentFormSchema = z.object({
  patientSearch: z.string(),
});

type AppointmentFormData = z.infer<typeof appointmentFormSchema>;

export function AppointmentForm({ appointment: ap }: { appointment: AppointmentHydrated }) {
  const [patient, setPatient] = useState<PatientNamePhone>(ap.patient);
  const [patients, setPatients] = useState<PatientsIndexedByName | "error">();
  const [matchingPatients, setMatchingPatients] = useState<SearchFieldOptions[]>([]);

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentsSchema),
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 md:gap-6">
        <div className="space-y-2">
          <SelectedPatient
            id={patient.id}
            name={patient.name}
            phone={patient.phone}
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

        {/* <TextField form={form} label="DoctorId" name="doctorId" />
        <DateField form={form} label="startTime" name="startTime" placeholder="Pick a date" /> */}
        {/* <DurationField form={form} name="duration" label="Duration" /> */}
        <SubmitButton form={form} label="Save" />
      </form>
    </Form>
  );
}

export interface SelectedPatientLoadingProps {
  loading: true;
  id?: string;
  name?: string;
  phone?: string;
}

export interface SelectedPatientProps {
  loading: false;
  id: string;
  name: string;
  phone: string;
}

export function SelectedPatient({
  id,
  name,
  phone,
  loading,
}: SelectedPatientLoadingProps | SelectedPatientProps) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium">Patient</p>
      <Link
        href={`/admin/patients/${id}`}
        target="_blank"
        className="border-1 group flex w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-accent p-3 text-sm"
      >
        {loading ? (
          <>
            <LoadingSpinner className="h-4 w-4" />
            <p>Loading...</p>
          </>
        ) : (
          <>
            <UserIcon className="h-4 w-4" />
            <p>
              {name} | {phone}
            </p>
            <div className="ml-auto flex items-center gap-2 pt-[2px]">
              <p className="text-xs uppercase">EDIT DETAILS</p>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
