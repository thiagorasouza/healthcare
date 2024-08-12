import DoctorCardSkeleton from "@/components/doctors/DoctorCardSkeleton";
import ErrorCard from "@/components/shared/ErrorCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getImageLink } from "@/lib/actions/getImageLink";
import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
import { cn, getInitials } from "@/lib/utils";

export default function DoctorCard({
  data,
  className,
  loading,
}: {
  data: DoctorDataUpdate | undefined;
  className?: string;
  loading: boolean;
}) {
  if (loading) {
    return <DoctorCardSkeleton className={className} />;
  }

  if (!data) {
    return <ErrorCard text="Unable to load this doctor's information at this time" />;
  }

  return (
    <Card className={cn("shadow", className)}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={getImageLink(data.pictureId)} />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{`Dr. ${data.name}`}</CardTitle>
            <CardDescription>{data.specialty}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p>{data ? data.bio : "Unable to load this doctor's information"}</p>
      </CardContent>
    </Card>
  );
}
