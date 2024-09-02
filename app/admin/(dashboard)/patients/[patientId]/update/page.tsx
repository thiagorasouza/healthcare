"use server";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import PatientUpdateCard from "@/components/patients/PatientUpdateCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { Button } from "@/components/ui/button";
import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { getPatient } from "@/lib/actions/getPatient";
import { env } from "@/lib/env";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function PatientUpdatePage({ params }: { params: { patientId: string } }) {
  const { patientId } = params;
  const patientResult = await getPatient(patientId);
  const patient = patientResult?.data;
  const identificationResult =
    patient && (await getFileMetadataServer(env.docsBucketId, patient.identificationId));
  const identification = identificationResult?.data;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-3 flex items-center">
        {patient && <AdminBreadcrumb replace={patientId} replacement={patient.name} />}
        <Button variant="outline" className="ml-auto">
          <Link href="/admin/patients" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      {patientResult.success && patient && identification ? (
        <PatientUpdateCard data={patient} identification={identification} />
      ) : (
        <ErrorCard text="Patient not found" />
      )}
    </div>
  );
}
