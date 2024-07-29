"use server";

import DoctorsForm from "@/components/forms/DoctorsForm";
import { Button } from "@/components/ui/button";
import { getDoctor } from "@/lib/actions/getDoctor";
import { updateDoctor } from "@/lib/actions/updateDoctor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function DoctorsUpdatePage({
  params,
}: {
  params: { doctorId: string };
}) {
  const { doctorId } = params;
  const result = await getDoctor(doctorId);

  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div className="flex">
        <h1 className="mb-8 w-fit border-b border-border pb-2 text-2xl font-semibold tracking-tight md:text-3xl">
          Update Doctor
        </h1>
        <Button variant="outline" className="ml-auto">
          <Link href="/admin/doctors" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      {result.success && result.data ? (
        <DoctorsForm doctorData={result.data} action={updateDoctor} />
      ) : (
        <p>Doctor not found</p>
      )}
    </div>
  );
}
