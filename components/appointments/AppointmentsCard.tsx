import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function AppointmentsCard() {
  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div>
            <CardTitle>Appointments</CardTitle>
            <CardDescription>Recently scheduled appointments</CardDescription>
          </div>
          <div className="ml-auto">
            <Button size="sm" asChild>
              <Link href="/admin/appointments/create">
                <PlusCircle className="h-4 w-4" />
                Create Appointment
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <AppointmentsTable />
      </CardContent>
    </Card>
  );
}
