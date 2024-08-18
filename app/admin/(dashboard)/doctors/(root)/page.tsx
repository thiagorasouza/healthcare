"use client";

import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { DoctorsColumns } from "@/components/doctors/DoctorsColumns";
import { DataTable } from "@/components/shared/DataTable";
import DeleteDialog from "@/components/shared/DeleteDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteDoctor } from "@/lib/actions/deleteDoctor";
import { getAllDoctors } from "@/lib/actions/getAllDoctors";
import { DoctorDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DoctorsPage() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorDocumentSchema[]>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<DoctorDocumentSchema | undefined>();

  useEffect(() => {
    if (!loading) return;

    const asyncEffect = async () => {
      try {
        const result = await getAllDoctors();
        if (result.success && result.data) {
          setDoctors(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    asyncEffect();
  }, [loading]);

  async function onDeleteClick(doctor: DoctorDocumentSchema) {
    setDoctorToDelete(doctor);
    setDeleteDialogOpen(true);
  }

  async function deleteSelectedDoctor() {
    if (!doctorToDelete) return;

    const { $id: doctorId, authId, name } = doctorToDelete;

    const result = await deleteDoctor(doctorId, authId);

    if (!result.success) {
      toast(`Unable to delete doctor ${name}`);
      return;
    }

    toast(`Doctor ${name} deleted successfully.`);
    setDoctorToDelete(undefined);
    setLoading(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <AdminBreadcrumb />
        <Button size="sm" className="ml-auto h-8 w-fit">
          <Link href="/admin/doctors/create" className="flex items-center gap-2">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sm:whitespace-nowrap">Add Doctor</span>
          </Link>
        </Button>
      </div>
      <Card className="max-sm:p-0">
        <CardHeader className="max-sm:px-4 max-sm:pt-5">
          <CardTitle>Doctors</CardTitle>
          <CardDescription>Manage doctors and adjust their availabilities.</CardDescription>
        </CardHeader>
        <CardContent className="max-sm:p-4 max-sm:pt-0">
          {loading ? (
            "Loading..."
          ) : doctors ? (
            <DataTable columns={DoctorsColumns(onDeleteClick)} data={doctors} />
          ) : (
            "Not doctors found"
          )}
        </CardContent>
      </Card>
      <DeleteDialog
        open={deleteDialogOpen}
        onCloseClick={() => setDeleteDialogOpen(false)}
        type="doctor"
        item={doctorToDelete?.name}
        onContinue={deleteSelectedDoctor}
      />
    </div>
  );
}
