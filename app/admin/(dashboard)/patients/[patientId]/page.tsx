"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import PatientForm from "@/components/patients/PatientForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { objectToFormData } from "@/lib/utils";
import { getPatient } from "@/server/actions/getPatient.bypass";
import { PatientFormData, patientFormSchema } from "@/server/adapters/zod/patientValidator";
import { PatientModel } from "@/server/domain/models/patientModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function PatientEditPage({ params }: { params: { patientId: string } }) {
  const { patientId } = params;
  const [patient, setPatient] = useState<PatientModel | "error">();

  async function loadPatient() {
    try {
      const patientResult = await getPatient(objectToFormData({ id: patientId }));
      if (!patientResult.ok) {
        setPatient("error");
        return;
      }
      setPatient(patientResult.value);
    } catch (error) {
      console.log(error);
      setPatient("error");
    }
  }

  useEffect(() => {
    loadPatient();
  }, []);

  const loading = !patient;
  const error = patient === "error";

  if (error) {
    return <ErrorCard text="Patient not found" />;
  }

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-6">
      <AdminBreadcrumbWithBackLink backLink="/admin/doctors" />
      <DefaultCard title="Edit Patient" description="Modify this patient's details">
        {loading ? (
          <LoadingSpinner size={24} className="mx-auto" />
        ) : (
          <PatientFormWrapper patient={patient} />
        )}
      </DefaultCard>
    </div>
  );
}

function PatientFormWrapper({ patient }: { patient: PatientModel }) {
  const router = useRouter();

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patient,
  });

  function onPatientSaved() {
    toast("Patient saved successfully.");
    router.push("/admin/patients");
  }

  return (
    <PatientForm form={form} mode="update" patient={patient} onPatientSaved={onPatientSaved} />
  );
}
