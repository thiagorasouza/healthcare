"use server";

import AvailabilityForm from "@/components/forms/AvailabilityForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createAvailability } from "@/lib/actions/createAvailability";
import { getDoctor } from "@/lib/actions/getDoctor";

export default async function AvailabilitiesPage({ params }: { params: { doctorId: string } }) {
  const { doctorId } = params;
  // console.log("🚀 ~ doctorId:", doctorId);

  const result = await getDoctor(doctorId);
  if (!result.success || !result.data) {
    return <p>Doctor not found</p>;
  }

  const doctor = result.data;
  // console.log("🚀 ~ result:", result);

  return (
    <div className="mx-auto space-y-4">
      <Card className="max-w-[600px] shadow">
        <CardHeader>
          <CardTitle>{`Dr. ${doctor.name}`}</CardTitle>
          <CardDescription>{doctor.specialty}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>{doctor.bio}</p>
        </CardContent>
      </Card>

      <AvailabilityForm
        title="Insert Slots"
        description="Make this doctor available on specific dates and time periods"
        action={createAvailability}
      />
    </div>
  );
}
