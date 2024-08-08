import { Button } from "@/components/ui/button";
import { processSlots } from "@/lib/processing/processSlots";

import { SlotDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { parseDbData } from "@/lib/schemas/slotsSchema";
import { getTimeFromDate } from "@/lib/utils";
import { format } from "date-fns";

export default function SlotsList({
  data,
  onClick,
}: {
  data: SlotDocumentSchema;
  onClick: (data: SlotDocumentSchema) => void;
}) {
  const slots = processSlots(parseDbData(data));
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
