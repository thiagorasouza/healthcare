"use client";

import ErrorCard from "@/components/shared/ErrorCard";
import SlotsCard from "@/components/slots/SlotsCard";
import SlotsButtonList from "@/components/slots/SlotsButtonList";
import { Spinner } from "@/components/ui/spinner";
import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { Button } from "@/components/ui/button";

interface SlotsListProps {
  data: PatternDocumentListSchema | undefined;
  loading: boolean;
  onSlotClick: (pattern: PatternDocumentSchema) => void;
  onCreateClick: () => void;
  className?: string;
}

export default function SlotsList({
  data,
  loading,
  onSlotClick,
  className,
  onCreateClick,
}: SlotsListProps) {
  if (loading) {
    return (
      <SlotsCard className={className}>
        <Spinner>Loading...</Spinner>
      </SlotsCard>
    );
  }

  if (!data) {
    return <ErrorCard className={className} text="Unable to load slots at this time." />;
  }

  return (
    <SlotsCard className={className}>
      <div className="flex flex-col gap-6">
        {data.total > 0 ? (
          data.documents.map((pattern, index) => (
            <SlotsButtonList key={index} data={pattern} onClick={() => onSlotClick(pattern)} />
          ))
        ) : (
          <>
            <p>No slots yet, start by clicking below</p>
            <Button className="w-fit" onClick={onCreateClick}>
              Add new slots
            </Button>
          </>
        )}
      </div>
    </SlotsCard>
  );
}
