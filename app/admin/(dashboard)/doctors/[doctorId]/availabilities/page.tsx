"use server";

import Availabilities from "@/components/availabilities/Availabilities";
import DoctorCard from "@/components/doctors/DoctorCard";
import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { createAvailability } from "@/lib/actions/createAvailability";
import { getAvailabilities } from "@/lib/actions/getAvailabilities";
import { getDoctor } from "@/lib/actions/getDoctor";

export default async function AvailabilitiesPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;

  const doctorResult = await getDoctor(doctorId);
  if (!doctorResult.success || !doctorResult.data) {
    return <p>Doctor not found</p>;
  }
  const doctor = doctorResult.data;

  const availabilitiesData = await getAvailabilities(doctor.doctorId);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="flex flex-col gap-4 self-start">
        <DoctorCard doctor={doctor} />
        <Availabilities data={availabilitiesData} />
      </div>
      <AvailabilityForm
        title="Insert Slots"
        description="Make this doctor available on specific dates and time periods"
        doctorId={doctorId}
        action={createAvailability}
        className="self-start"
      />
    </div>
  );
}
