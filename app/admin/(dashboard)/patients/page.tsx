"use client";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { PatientsColumns } from "@/components/patients/PatientsColumns";
import { DataTable } from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deletePatient } from "@/lib/actions/deletePatient";
import { getAllPatients } from "@/lib/actions/getAllPatients";
import { PatientStoredData } from "@/lib/schemas/patientsSchema";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PatientsPage() {
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState<PatientStoredData[]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<PatientStoredData | undefined>();

  useEffect(() => {
    if (!loading) return;

    const asyncEffect = async () => {
      try {
        const result = await getAllPatients();
        if (result.success && result.data) {
          setPatients(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    asyncEffect();
  }, [loading]);

  function onDeleteClick(patient: PatientStoredData) {
    setPatientToDelete(patient);
    setDeleteDialogOpen(true);
  }

  async function deleteSelectedPatient() {
    if (!patientToDelete) return;

    const { $id: patientId, authId, name } = patientToDelete;

    const result = await deletePatient(patientId, authId);

    if (!result.success) {
      toast(`Unable to delete doctor ${name}`);
      return;
    }

    toast(`Doctor ${name} deleted successfully.`);
    setPatientToDelete(undefined);
    setLoading(true);
  }

  // console.log("🚀 ~ patients:", patients);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminBreadcrumb />
        <Button size="sm" className="ml-auto h-8 w-fit">
          <Link href="/admin/patients/create" className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add Patient</span>
          </Link>
        </Button>
      </div>
      <Card className="max-sm:p-0">
        <CardHeader className="max-sm:px-4 max-sm:pt-5">
          <CardTitle>Patients</CardTitle>
          <CardDescription>Manage patients and adjust their details.</CardDescription>
        </CardHeader>
        <CardContent className="max-sm:p-4 max-sm:pt-0">
          {loading ? (
            "Loading..."
          ) : patients ? (
            <DataTable columns={PatientsColumns(onDeleteClick)} data={patients} />
          ) : (
            "Not patients found"
          )}
        </CardContent>
      </Card>
      {/* <DeleteDialog
        open={deleteDialogOpen}
        onCloseClick={() => setDeleteDialogOpen(false)}
        itemType="patient"
        itemName={patientToDelete?.name}
        onConfirmationClick={deleteSelectedPatient}
      /> */}
    </div>
  );
}
