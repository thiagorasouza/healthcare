"use client";

import ErrorCard from "@/components/shared/ErrorCard";
import SlotsCard from "@/components/slots/SlotsCard";
import SlotsButtonList from "@/components/slots/SlotsButtonList";
import { Spinner } from "@/components/ui/spinner";
import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";

interface SlotsListProps {
  data: PatternDocumentListSchema | undefined;
  loading: boolean;
  onSlotClick: (pattern: PatternDocumentSchema) => void;
}

export default function SlotsList({ data, loading, onSlotClick }: SlotsListProps) {
  if (loading) {
    return (
      <SlotsCard>
        <Spinner>Loading...</Spinner>
      </SlotsCard>
    );
  }

  if (!data) {
    return <ErrorCard text="Unable to load slots at this time." />;
  }

  return (
    <SlotsCard>
      <div className="flex flex-col gap-3">
        {data.total > 0 &&
          data.documents.map((pattern, index) => (
            <SlotsButtonList key={index} data={pattern} onClick={() => onSlotClick(pattern)} />
          ))}
      </div>
    </SlotsCard>
  );
}
