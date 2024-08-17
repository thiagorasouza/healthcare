import DefaultCard from "@/components/shared/DefaultCard";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { fullWeekdays, Weekday } from "@/lib/schemas/patternsSchema";
import { getTimeFromDate, semanticJoin } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  Fingerprint,
  Hourglass,
  Repeat2,
  SquarePen,
  Target,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { countSlotsInTimespan } from "@/lib/processing/countSlotsInTimespan";

interface PatternCardProps {
  data: PatternDocumentSchema | undefined;
  className?: string;
  onCloseClick: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
}

export default function PatternCard({
  data,
  className,
  onCloseClick,
  onDeleteClick,
  onEditClick,
}: PatternCardProps) {
  if (!data) return null;

  const recurring = data.recurring;
  const slotsNum = countSlotsInTimespan(data.startTime, data.endTime, data.duration);

  return (
    <DefaultCard
      title={recurring ? "Pattern" : "Single Date"}
      description={
        recurring ? "Edit to make this a single date" : "Edit to make this a recurring pattern"
      }
      className={className}
      onCloseClick={onCloseClick}
    >
      <div className="flex flex-col gap-2 text-sm [&>div]:flex [&>div]:items-center [&_svg]:mr-3 [&_svg]:h-4 [&_svg]:w-4">
        <div className="font-semibold">
          <Repeat2 />
          {recurring ? "Recurring" : "Non recurring"}
        </div>
        <div>
          <Hourglass />
          {data.duration} minutes each
        </div>
        <div>
          <Clock />
          {getTimeFromDate(new Date(data.startTime))} &rarr;{" "}
          {getTimeFromDate(new Date(data.endTime))} ({slotsNum} slots)
        </div>
        {recurring && (
          <div>
            <Target />
            {semanticJoin((data.weekdays as Weekday[]).map((w) => fullWeekdays[w]))}
          </div>
        )}
        {recurring ? (
          <div>
            <CalendarDays />
            {format(data.startDate, "PPP")} &rarr; {format(data.endDate, "PPP")}
          </div>
        ) : (
          <div>
            <CalendarDays />
            {format(data.startDate, "PPP")}
          </div>
        )}
        <div>
          <Fingerprint />
          ID: {data.$id}
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Button variant="destructive" className="flex items-center gap-2" onClick={onDeleteClick}>
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
        <Button className="flex items-center gap-2" onClick={() => onEditClick()}>
          <SquarePen className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </DefaultCard>
  );
}
