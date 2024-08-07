"use server";

import DoctorCard from "@/components/doctors/DoctorCard";
import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { createAvailability } from "@/lib/actions/createAvailability";
import { getDoctor } from "@/lib/actions/getDoctor";

export default async function AvailabilitiesPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;

  const result = await getDoctor(doctorId);
  if (!result.success || !result.data) {
    return <p>Doctor not found</p>;
  }
  const doctor = result.data;

  return (
    <div className="mx-auto flex gap-4">
      <div className="max-w-[600px]">
        <DoctorCard doctor={doctor} />
      </div>

      <div className="max-w-[600px]">
        <AvailabilityForm
          title="Insert Slots"
          description="Make this doctor available on specific dates and time periods"
          doctorId={doctorId}
          action={createAvailability}
        />
      </div>
    </div>
  );
}
