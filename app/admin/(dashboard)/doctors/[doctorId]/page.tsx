"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import DoctorForm from "@/components/doctors/DoctorForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { objectToFormData } from "@/lib/utils";
import { getDoctor } from "@/server/actions/getDoctor.bypass";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useEffect, useState } from "react";

export default function PatientEditPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;
  const [doctor, setDoctor] = useState<DoctorModel | "error">();

  async function loadDoctor() {
    try {
      const doctorResult = await getDoctor(objectToFormData({ id: doctorId }));
      if (!doctorResult.ok) {
        setDoctor("error");
        return;
      }
      setDoctor(doctorResult.value);
    } catch (error) {
      console.log(error);
      setDoctor("error");
    }
  }

  useEffect(() => {
    loadDoctor();
  }, []);

  const loading = !doctor;
  const error = doctor === "error";

  if (error) {
    return <ErrorCard text="Doctor not found" />;
  }

  return (
    <div className="mx-auto w-full max-w-[600px] space-y-4">
      <AdminBreadcrumbWithBackLink backLink="/admin/doctors" />
      <DefaultCard title="Edit Doctor" description="Modify this doctor's details">
        {loading ? (
          <LoadingSpinner size={24} className="mx-auto" />
        ) : (
          <DoctorForm mode="update" doctor={doctor} />
        )}
      </DefaultCard>
    </div>
  );
}
