"use client";

import DoctorCard from "@/components/doctors/DoctorCard";
import SlotsList from "@/components/slots/SlotsList";
import { getDoctor } from "@/lib/actions/getDoctor";
import { getPatterns } from "@/lib/actions/getPatterns";
import { useEffect, useState } from "react";
import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import PatternCard from "@/components/slots/PatternCard";
import { deletePattern } from "@/lib/actions/deletePattern";
import { toast } from "sonner";

export default function SlotsPage({ params }: { params: { doctorId: string } }) {
  const [selectedPattern, setSelectedPattern] = useState<PatternDocumentSchema>();
  const [doctor, setDoctor] = useState<DoctorDataUpdate>();
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [slots, setSlots] = useState<PatternDocumentListSchema>();
  const [slotsLoading, setSlotsLoading] = useState(true);

  const { doctorId } = params;

  useEffect(() => {
    const asyncFetch = async () => {
      const doctorResult = await getDoctor(doctorId);
      if (doctorResult.success && doctorResult.data) {
        setDoctor(doctorResult.data);
        setDoctorLoading(false);
      } else {
        setDoctorLoading(false);
        return;
      }

      const slotsResult = await getPatterns(doctorResult.data.doctorId);
      if (slotsResult.success && slotsResult.data) {
        setSlots(slotsResult.data);
      }
      setSlotsLoading(false);
    };

    asyncFetch();
  }, [doctorId]);

  async function deleteSelectedPattern(patternId: string) {
    const result = await deletePattern(patternId);
    if (!result.success) {
      toast(`Unable to delete pattern ${patternId} at this time`);
      return;
    }

    setSelectedPattern(undefined);
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col gap-8 self-start">
        <DoctorCard data={doctor} loading={doctorLoading} />
        <SlotsList data={slots} loading={slotsLoading} onSlotClick={setSelectedPattern} />
      </div>
      <div>
        <PatternCard
          data={selectedPattern}
          onCloseClick={() => setSelectedPattern(undefined)}
          onDeleteClick={deleteSelectedPattern}
        />
      </div>
      {/* <SlotsForm
        title="Insert Slots"
        description="Make this doctor available on specific dates and time periods"
        doctorId={doctorId}
        action={createSlot}
        className="self-start"
      /> */}
    </div>
  );
}
