"use client";

import ErrorCard from "@/components/shared/ErrorCard";
import { Spinner } from "@/components/ui/spinner";
import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { Button } from "@/components/ui/button";
import DefaultCard from "@/components/shared/DefaultCard";
import { processSlots } from "@/lib/processing/processSlots";
import { format } from "date-fns";
import { getHourStrFromDate } from "@/lib/utils";

interface SlotsCardProps {
  data: PatternDocumentListSchema | undefined;
  loading: boolean;
  onSlotClick: (pattern: PatternDocumentSchema) => void;
  onCreateClick: () => void;
  className?: string;
}

/**
 * PATTERNS: it is the database record containing the data necessary
 * to identify the available slots. The slots itself are not stored
 * in database. Instead, they are generated read/identified/generated
 * by the server using the processSlots function
 *
 * SLOTS: are the slots identified from the pattern data. They do
 * not exist in the database, or anywhere else. All the slots identi-
 * fication work is done server side to avoid hitting the Appwrite API
 * too many times.
 */
export default function SlotsCard({
  data,
  loading,
  onSlotClick,
  className,
  onCreateClick,
}: SlotsCardProps) {
  // console.log("🚀 ~ data:", data);

  const patterns = data?.documents;

  return (
    <DefaultCard title="Slots" description="Click a slot to edit or delete" className={className}>
      {loading ? (
        <Spinner>Loading...</Spinner>
      ) : !patterns ? (
        <ErrorCard className={className} text="Unable to load slots at this time." />
      ) : (
        <div className="flex flex-col gap-6">
          {patterns.length === 0 ? (
            <>
              <p>No slots yet</p>
              <Button className="w-fit" onClick={onCreateClick}>
                Add new slots
              </Button>
            </>
          ) : (
            patterns.map((pattern) => {
              const dates = processSlots(pattern);
              return dates.map(({ date, slots }) => (
                <SlotsListByDate
                  key={date}
                  date={date}
                  slots={slots}
                  recurring={pattern.recurring}
                  onSlotClick={() => onSlotClick(pattern)}
                />
              ));
            })
          )}
        </div>
      )}
    </DefaultCard>
  );
}

function SlotsListByDate({
  date,
  slots,
  recurring,
  onSlotClick,
}: {
  date: string;
  slots: Date[][];
  recurring: boolean;
  onSlotClick: () => void;
}) {
  return (
    <section className="space-y-2" key={date}>
      <h3 className="text-sm font-semibold">{format(new Date(date), "PPP")}</h3>
      <ul className="flex flex-wrap gap-2 text-sm">
        {slots.map((slot) => (
          <li key={slot[0].toString()}>
            <SlotButton
              recurring={recurring}
              start={getHourStrFromDate(slot[0])}
              end={getHourStrFromDate(slot[1])}
              onClick={onSlotClick}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SlotButton({
  recurring,
  start,
  end,
  onClick,
}: {
  recurring: boolean;
  start: string;
  end: string;
  onClick: () => void;
}) {
  return (
    <Button variant={recurring ? "secondary" : "outline"} onClick={onClick}>
      {`${start} - ${end}`}
    </Button>
  );
}
