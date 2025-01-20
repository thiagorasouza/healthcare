import DoctorsTable from "@/components/doctors/DoctorsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function DoctorsCard() {
  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div>
            <CardTitle>Doctors</CardTitle>
            <CardDescription>Manage doctors and adjust their availabilities.</CardDescription>
          </div>
          <div className="ml-auto">
            <Button size="sm" asChild>
              <Link href="/admin/appointments/create">
                <PlusCircle className="h-4 w-4" />
                Create Doctor
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DoctorsTable />
      </CardContent>
    </Card>
  );
}
