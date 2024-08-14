import DefaultCard from "@/components/shared/DefaultCard";
import SlotsButtonList from "@/components/slots/SlotsButtonList";
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
import { motion } from "framer-motion";
import { countSlotsInTimespan } from "@/lib/processing/countSlotsInTimespan";

interface PatternCardProps {
  data: PatternDocumentSchema;
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
  const slotsNum = countSlotsInTimespan(data.startTime, data.endTime, data.duration);

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden"
    >
      <DefaultCard
        title="Manage Availableness"
        description="Edit or delele this pattern"
        className={className}
        onCloseClick={onCloseClick}
      >
        <div className="flex flex-col gap-2 text-sm [&>div]:flex [&>div]:items-center [&_svg]:mr-3 [&_svg]:h-4 [&_svg]:w-4">
          <div className="font-semibold">
            <Repeat2 />
            {data.recurring ? "Recurring" : "Non recurring"}
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
          <div>
            <Target />
            {semanticJoin((data.weekdays as Weekday[]).map((w) => fullWeekdays[w]))}
          </div>
          <div>
            <CalendarDays />
            {format(data.startDate, "PPP")} &rarr; {format(data.endDate, "PPP")}
          </div>
          <div>
            <Fingerprint />
            ID: {data.$id}
          </div>
        </div>
        <div className="my-6 flex flex-col gap-3">
          <SlotsButtonList data={data} onClick={() => null} />
        </div>
        <div className="flex gap-3">
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
    </motion.div>
  );
}
