"use server";

import SlotsForm from "@/components/slots/SlotsForm";
import SlotsManager from "@/components/slots/SlotsManager";
import DoctorCard from "@/components/doctors/DoctorCard";

import { getDoctor } from "@/lib/actions/getDoctor";
import { createSlot } from "@/lib/actions/createSlot";
import { getSlots } from "@/lib/actions/getSlots";

export default async function SlotsPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;

  const doctorResult = await getDoctor(doctorId);
  if (!doctorResult.success || !doctorResult.data) {
    return <p>Doctor not found</p>;
  }
  const doctor = doctorResult.data;

  const slotsData = await getSlots(doctor.doctorId);

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-8 self-start">
        <DoctorCard doctor={doctor} />
        <SlotsManager data={slotsData} />
      </div>
      <SlotsForm
        title="Insert Slots"
        description="Make this doctor available on specific dates and time periods"
        doctorId={doctorId}
        action={createSlot}
        className="self-start"
      />
    </div>
  );
}
