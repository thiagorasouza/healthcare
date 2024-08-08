"use client";

import AvailabilitiesCard from "@/components/availabilities/AvailabilitiesCard";
import DefaultCard from "@/components/availabilities/DefaultCard";
import { Button } from "@/components/ui/button";
import { getSlots } from "@/lib/processing/getSlots";
import { Error, Success } from "@/lib/results";
import { AvDocumentListSchema, AvDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { fullWeekdays, parseDbData, Weekday } from "@/lib/schemas/availabilitySchema";
import { cn, getTimeFromDate, semanticJoin } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, Clock, Fingerprint, Hourglass, Repeat2, Target } from "lucide-react";
import { useState } from "react";

export default function Availabilities({
  data,
}: {
  data: Success<AvDocumentListSchema> | Error<unknown>;
}) {
  console.log("🚀 ~ data:", data);
  const [currentAv, setCurrentAv] = useState<AvDocumentSchema>();

  function showAvailabilityCard(data: AvDocumentSchema) {
    setCurrentAv(data);
  }

  if (!data.success || !data.data || data.data.total === 0) {
    return (
      <AvailabilitiesCard>
        <p>No slots registered yet</p>
      </AvailabilitiesCard>
    );
  }

  const availabilities = data.data.documents;

  return currentAv ? (
    <AvailabilityCard data={currentAv} onCloseClick={() => setCurrentAv(undefined)} />
  ) : (
    <AvailabilitiesCard>
      <div className="flex flex-col gap-3">
        {availabilities.map((data, index) => (
          <AvailabilityButtons key={index} data={data} onClick={showAvailabilityCard} />
        ))}
      </div>
    </AvailabilitiesCard>
  );
}

function AvailabilityCard({
  data,
  className,
  onCloseClick,
}: {
  data: AvDocumentSchema | undefined;
  className?: string;
  onCloseClick: () => void;
}) {
  if (!data) return null;

  return (
    <DefaultCard
      title="Manage Availableness"
      description="Edit or delele this pattern"
      className={cn("transition delay-150 duration-300 ease-in-out", className)}
      onCloseClick={onCloseClick}
    >
      <div className="flex flex-col gap-2 text-sm [&>div]:flex [&>div]:items-center [&_svg]:mr-3 [&_svg]:h-4 [&_svg]:w-4">
        <div className="font-semibold">
          <Repeat2 />
          {data.recurring ? "Recurring" : "Non recurring"}
        </div>
        <div>
          <Clock />
          {getTimeFromDate(new Date(data.startTime))} &rarr;{" "}
          {getTimeFromDate(new Date(data.endTime))}
        </div>
        <div>
          <Hourglass />
          {data.duration} minutes each
        </div>
        <div>
          <CalendarDays />
          {format(data.startDate, "PPP")} &rarr; {format(data.endDate, "PPP")}
        </div>
        <div>
          <Target />
          {semanticJoin((data.weekdays as Weekday[]).map((w) => fullWeekdays[w]))}
        </div>
        <div>
          <Fingerprint />
          ID: {data.$id}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <AvailabilityButtons data={data} onClick={() => null} />
      </div>
    </DefaultCard>
  );
}

function AvailabilityButtons({
  data,
  onClick,
}: {
  data: AvDocumentSchema;
  onClick: (data: AvDocumentSchema) => void;
}) {
  const slots = getSlots(parseDbData(data));
  return slots.map((slotsData) => {
    const day = format(new Date(slotsData.date), "PPP");
    return (
      <div className="space-y-2" key={slotsData.date}>
        <p className="font-semibold">{day}</p>
        <ul className="flex flex-wrap gap-2 text-sm">
          {slotsData.slots.map((slot) => (
            <li key={slot[0].toString()}>
              <Button
                variant="outline"
                onClick={() => onClick(data)}
              >{`${getTimeFromDate(slot[0])} - ${getTimeFromDate(slot[1])}`}</Button>
            </li>
          ))}
        </ul>
      </div>
    );
  });
}
