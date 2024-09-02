import DoctorCardSkeleton from "@/components/doctors/DoctorCardSkeleton";
import ErrorCard from "@/components/shared/ErrorCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFileLink } from "@/lib/actions/getFileLink";
import { env } from "@/lib/env";
import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
import { cn, getInitials } from "@/lib/utils";
import { Search } from "lucide-react";

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
        <div className="flex justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={getFileLink(env.imagesBucketId, data.pictureId)} />
              <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{`Dr. ${data.name}`}</CardTitle>
              <CardDescription>{data.specialty}</CardDescription>
            </div>
          </div>
          <div className="gap-3">
            <Button className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              View
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
