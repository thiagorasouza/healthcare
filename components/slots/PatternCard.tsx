import SlotsList from "@/components/slots/SlotsList";
import DefaultCard from "@/components/shared/DefaultCard";
import { SlotDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { fullWeekdays, Weekday } from "@/lib/schemas/slotsSchema";
import { cn, getTimeFromDate, semanticJoin } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarDays, Clock, Fingerprint, Hourglass, Repeat2, Target } from "lucide-react";

export default function PatternCard({
  data,
  className,
  onCloseClick,
}: {
  data: SlotDocumentSchema | undefined;
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
      <div className="my-6 flex flex-col gap-3">
        <SlotsList data={data} onClick={() => null} />
      </div>
    </DefaultCard>
  );
}
