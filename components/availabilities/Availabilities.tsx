import AvailabilitiesCard from "@/components/availabilities/AvailabilitiesCard";
import { getSlots } from "@/lib/processing/getSlots";
import { Error, Success } from "@/lib/results";
import { AvDocumentListSchema } from "@/lib/schemas/appwriteSchema";
import { parseDbData } from "@/lib/schemas/availabilitySchema";
import { getTimeFromDate } from "@/lib/utils";
import { format } from "date-fns";

export default function Availabilities({
  data,
}: {
  data: Success<AvDocumentListSchema> | Error<unknown>;
}) {
  if (!data.success || !data.data || data.data.total === 0) {
    return (
      <AvailabilitiesCard>
        <p>No slots registered yet</p>
      </AvailabilitiesCard>
    );
  }

  const availabilities = data.data.documents;

  return (
    <AvailabilitiesCard>
      <div className="flex flex-col gap-3">
        {availabilities.map((availability, index) => {
          const slots = getSlots(parseDbData(availability));
          return slots.map((slotsData) => {
            const day = format(new Date(slotsData.date), "PPP");
            return (
              <div className="space-y-2" key={slotsData.date}>
                <p className="font-semibold">{day}</p>
                <ul className="flex gap-2 text-sm">
                  {slotsData.slots.map((slot) => (
                    <li
                      key={slot[0].toString()}
                      className="w-fit cursor-pointer rounded-md border px-3 py-2 text-muted-foreground hover:bg-muted hover:text-black"
                    >{`${getTimeFromDate(slot[0])} - ${getTimeFromDate(slot[1])}`}</li>
                  ))}
                </ul>
              </div>
            );
          });
        })}
      </div>
    </AvailabilitiesCard>
  );
}
