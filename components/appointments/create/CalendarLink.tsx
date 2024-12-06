import { Button } from "@/components/ui/button";
import { createCalendarLink, EventDetails } from "@/server/useCases/shared/helpers/utils";
import { CalendarDays, CalendarPlus } from "lucide-react";
import Link from "next/link";

export interface CalendarLinkProps {
  name: string;
  specialty: string;
  startTime: Date;
  duration: number;
}

export function CalendarLink({
  name,
  specialty,
  startTime: startTime,
  duration,
}: CalendarLinkProps) {
  const event: EventDetails = {
    title: `Appointment with Dr. ${name} (${specialty})`,
    date: startTime,
    duration,
    description: "You have an appointment scheduled by Mednow",
  };
  const link = createCalendarLink(event);

  return (
    <Button asChild className="bg-darker-purple">
      <Link href={link} target="_blank">
        <CalendarPlus />
        Add to Google Calendar
      </Link>
    </Button>
  );
}
