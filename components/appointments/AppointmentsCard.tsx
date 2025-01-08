import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AppointmentsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Appointments</CardTitle>
        <CardDescription>Recently scheduled appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <AppointmentsTable />
      </CardContent>
    </Card>
  );
}
