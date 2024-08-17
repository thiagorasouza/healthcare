import { Button } from "@/components/ui/button";
import { processSlots } from "@/lib/processing/processSlots";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { getTimeFromDate } from "@/lib/utils";
import { format } from "date-fns";

export default function SlotsButtonList({
  data,
  onClick,
}: {
  data: PatternDocumentSchema;
  onClick: (data: PatternDocumentSchema) => void;
}) {
  const slots = processSlots(data);
  // console.log("🚀 ~ slots:", slots);
  return slots.map((slotsData) => {
    const day = format(new Date(slotsData.date), "PPP");
    return (
      <div className="space-y-2" key={slotsData.date}>
        <p className="text-sm font-semibold">{day}</p>
        <ul className="flex flex-wrap gap-2 text-sm">
          {slotsData.slots.map((slot) => (
            <li key={slot[0].toString()}>
              <Button
                variant={data.recurring ? "secondary" : "outline"}
                onClick={() => onClick(data)}
              >{`${getTimeFromDate(slot[0])} - ${getTimeFromDate(slot[1])}`}</Button>
            </li>
          ))}
        </ul>
      </div>
    );
  });
}
