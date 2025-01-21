import PatientsTable from "@/components/patients/PatientsTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export function PatientsCard() {
  return (
    <Card className="shadow">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div>
            <CardTitle>Patients</CardTitle>
            <CardDescription>Manage patients and adjust their details.</CardDescription>
          </div>
          <div className="ml-auto">
            <Button size="sm" asChild>
              <Link href="/admin/patients/create">
                <PlusCircle className="h-4 w-4" />
                Create Patient
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <PatientsTable />
      </CardContent>
    </Card>
  );
}
