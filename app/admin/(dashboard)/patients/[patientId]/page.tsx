"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import PatientForm from "@/components/patients/PatientForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { objectToFormData } from "@/lib/utils";
import { getPatient } from "@/server/actions/getPatient.bypass";
import { patientFormSchema } from "@/server/adapters/zod/patientValidator";
import { PatientData } from "@/server/domain/models/patientData";
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

  const form = useForm<PatientData>({
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

// "use server";

// import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
// import PatientUpdateCard from "@/components/patients/PatientUpdateCard";
// import ErrorCard from "@/components/shared/ErrorCard";
// import { Button } from "@/components/ui/button";
// import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
// import { getPatient } from "@/lib/actions/getPatient";
// import { env } from "@/lib/env";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// export default async function PatientUpdatePage({ params }: { params: { patientId: string } }) {
//   const { patientId } = params;
//   const patientResult = await getPatient(patientId);
//   const patient = patientResult?.data;
//   const identificationResult =
//     patient && (await getFileMetadataServer(env.docsBucketId, patient.identificationId));
//   const identification = identificationResult?.data;

//   return (
//     <div className="mx-auto w-full max-w-3xl">
//       <div className="mb-3 flex items-center">
//         {patient && <AdminBreadcrumb replace={patientId} replacement={patient.name} />}
//         <Button variant="outline" className="ml-auto">
//           <Link href="/admin/patients" className="flex items-center">
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back
//           </Link>
//         </Button>
//       </div>
//       {patientResult.success && patient && identification ? (
//         <PatientUpdateCard data={patient} identification={identification} />
//       ) : (
//         <ErrorCard text="Patient not found" />
//       )}
//     </div>
//   );
// }
