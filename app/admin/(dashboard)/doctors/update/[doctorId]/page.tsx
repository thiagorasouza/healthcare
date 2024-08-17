"use server";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import DoctorsForm from "@/components/doctors/DoctorsForm";

import { Button } from "@/components/ui/button";
import { getDoctor } from "@/lib/actions/getDoctor";
import { updateDoctor } from "@/lib/actions/updateDoctor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DoctorsUpdatePage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;
  const result = await getDoctor(doctorId);

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-3 flex items-center justify-between">
        <AdminBreadcrumb />
        <Button variant="outline">
          <Link href="/admin/doctors" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      {result.success && result.data ? (
        <DoctorsForm
          title="Update Doctor"
          description="Update this doctor and the user account associated with it"
          doctorData={result.data}
          action={updateDoctor}
        />
      ) : (
        <p>Doctor not found</p>
      )}
    </div>
  );
}
