import DefaultCard from "@/components/shared/DefaultCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getInitials } from "@/lib/utils";
import { AppointmentHydrated } from "@/server/domain/models/appointmentHydrated";
import { getHoursStr } from "@/server/shared/helpers/date";
import { format } from "date-fns";
import { CalendarDays, CircleUserRound, Clock, Hourglass } from "lucide-react";

export function AppointmentView({ appointment: ap }: { appointment: AppointmentHydrated }) {
  return (
    <DefaultCard
      title="Appointment Booked"
      description="Your appointment was booked successfully"
      className="col-span-4 self-start"
    >
      <div className="mb-8 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={getImageLink(ap.doctor.pictureId)} />
          <AvatarFallback>{getInitials(ap.doctor.name)}</AvatarFallback>
        </Avatar>
        <div className="font-semibold">
          <p className="text-lg">{`Dr. ${ap.doctor.name}`}</p>
          <p className="text-sm text-gray">{ap.doctor.specialty}</p>
        </div>
        <div>
          <p></p>
        </div>
      </div>
      <div className="mb-8 flex items-center gap-3 self-start">
        <div>
          <CircleUserRound className="h-9 w-9" />
        </div>
        <div>
          <p className="font-semibold">{ap.patient.name}</p>
          <p className="text-sm">
            {ap.patient.email} | {ap.patient.phone}
          </p>
        </div>
      </div>
      <div className="mb-8 space-y-2 text-sm">
        <p className="flex items-center gap-3">
          <CalendarDays className="h-4 w-4" />
          {format(ap.startTime, "PPP")}
        </p>
        <p className="flex items-center gap-3">
          <Clock className="h-4 w-4" />
          {getHoursStr(ap.startTime)}
        </p>
        <p className="flex items-center gap-3">
          <Hourglass className="h-4 w-4" />
          {ap.duration} minutes
        </p>
      </div>
      {/* <Button asChild>
          <Link href="/admin/appointments" className="flex items-center">
            <ArrowUpRight className="h-4 w-4" /> View All Appointments
          </Link>
        </Button> */}
    </DefaultCard>
  );
}
