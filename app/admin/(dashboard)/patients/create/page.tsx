"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import DefaultCard from "@/components/shared/DefaultCard";
import PatientForm from "@/components/patients/PatientForm";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientDefaultValues, patientFormSchema } from "@/server/adapters/zod/patientValidator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PatientData } from "@/server/domain/models/patientData";

export default function PatientCreatePage() {
  const router = useRouter();

  const form = useForm<PatientData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patientDefaultValues,
  });

  function onPatientSaved() {
    toast("Patient saved successfully.");
    router.push("/admin/patients");
  }

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-4">
      <AdminBreadcrumbWithBackLink backLink="/admin/patients" />
      <DefaultCard title="Create Patient" description="Fill the form to create a new patient">
        <PatientForm form={form} mode="create" onPatientSaved={onPatientSaved} />
      </DefaultCard>
    </div>
  );
}
