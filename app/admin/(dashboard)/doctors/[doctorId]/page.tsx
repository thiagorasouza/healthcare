"use client";

import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import DoctorsForm from "@/components/doctors/DoctorsForm";
import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { objectToFormData } from "@/lib/utils";
import { getDoctor } from "@/server/actions/getDoctor";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { useEffect, useState } from "react";

export default function DoctorsUpdatePage({ params }: { params: { doctorId: string } }) {
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
    <div className="mx-auto w-full max-w-[600px] space-y-6">
      <AdminBreadcrumbWithBackLink backLink="/admin/doctors" />
      <DefaultCard
        title="Create Doctor"
        description="Create a new doctor and a user account associated with it"
      >
        {loading ? (
          <LoadingSpinner size={24} className="mx-auto" />
        ) : (
          <DoctorsForm mode="update" doctor={doctor} />
        )}
      </DefaultCard>
    </div>
  );

  // return (
  //   <div className="mx-auto w-full max-w-[600px]">
  //     <div className="mb-3 flex items-center">
  //       {doctor && <AdminBreadcrumb replace={doctorId} replacement={doctor.name} />}
  //       <Button variant="outline" className="ml-auto">
  //         <Link href="/admin/doctors" className="flex items-center">
  //           <ArrowLeft className="mr-2 h-4 w-4" />
  //           Back
  //         </Link>
  //       </Button>
  //     </div>
  //     {result.success && doctor ? (
  //       <DoctorsForm
  //         title="Update Doctor"
  //         description="Update this doctor and the user account associated with it"
  //         doctor={doctor}
  //         action={updateDoctor}
  //       />
  //     ) : (
  //       <ErrorCard text="Doctor not found" />
  //     )}
  //   </div>
  // );
}
