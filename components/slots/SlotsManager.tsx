"use client";

import PatternCard from "@/components/slots/PatternCard";
import SlotsCard from "@/components/slots/SlotsCard";
import SlotsList from "@/components/slots/SlotsList";
import { Error, Success } from "@/lib/results";
import { SlotDocumentListSchema, SlotDocumentSchema } from "@/lib/schemas/appwriteSchema";

import { useState } from "react";

export default function SlotsManager({
  data,
}: {
  data: Success<SlotDocumentListSchema> | Error<unknown>;
}) {
  // console.log("🚀 ~ data:", data);
  const [currentAv, setCurrentAv] = useState<SlotDocumentSchema>();

  function showAvailabilityCard(data: SlotDocumentSchema) {
    setCurrentAv(data);
  }

  if (!data.success || !data.data || data.data.total === 0) {
    return (
      <SlotsCard>
        <p>No slots registered yet</p>
      </SlotsCard>
    );
  }

  const availabilities = data.data.documents;

  return currentAv ? (
    <PatternCard data={currentAv} onCloseClick={() => setCurrentAv(undefined)} />
  ) : (
    <SlotsCard>
      <div className="flex flex-col gap-3">
        {availabilities.map((data, index) => (
          <SlotsList key={index} data={data} onClick={showAvailabilityCard} />
        ))}
      </div>
    </SlotsCard>
  );
}
