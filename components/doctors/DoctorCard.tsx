import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageLink } from "@/lib/actions/getImageLink";
import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
import { cn, getInitials } from "@/lib/utils";

export default function DoctorCard({
  doctor,
  className,
}: {
  doctor: DoctorDataUpdate;
  className?: string;
}) {
  const pictureUrl = getImageLink(doctor.pictureId);

  return (
    <Card className={cn("shadow", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={pictureUrl} />
            <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{`Dr. ${doctor.name}`}</CardTitle>
            <CardDescription>{doctor.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{doctor.bio}</p>
      </CardContent>
    </Card>
  );
}
