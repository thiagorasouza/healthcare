"use client";

import ErrorCard from "@/components/shared/ErrorCard";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDeleteDialog } from "@/lib/hooks/useDeleteDialog";
import { deletePatient } from "@/server/actions/deletePatient.bypass";
import { listPatients } from "@/server/actions/listPatients.bypass";
import { displayError } from "@/server/config/errors";
import { PatientModel } from "@/server/domain/models/patientModel";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { CalendarDays, PlusCircle, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PatientsTable() {
  const { openDeleteDialog, deleteDialog } = useDeleteDialog(handleDelete);
  const [patients, setPatients] = useState<PatientModel[] | "error">();

  const loading = patients === undefined;
  const error = patients === "error";
  const empty = patients?.length === 0;

  async function loadPatients() {
    try {
      const result = await listPatients();
      if (!result.ok) {
        setPatients("error");
      } else {
        setPatients(result.value);
      }
    } catch (error) {
      console.log(error);
      setPatients("error");
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  async function handleDelete(id: string) {
    try {
      const deleteResult = await deletePatient(objectToFormData({ id }));
      if (!deleteResult.ok) {
        toast(displayError(deleteResult));
        return;
      }

      toast(`Patient deleted successfully.`);
      loadPatients();
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <LoadingSpinner />
      </div>
    );
  } else if (empty) {
    return (
      <>
        <p>No patients yet.</p>
        <Button asChild className="mt-6">
          <Link href="/admin/appointments/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      </>
    );
  } else if (error) {
    return <ErrorCard text="Unable to query for patients at this time. Please try again later." />;
  }

  return (
    <>
      {deleteDialog}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Insurance</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.email}</TableCell>
              <TableCell>{patient.phone}</TableCell>
              <TableCell>{patient.insuranceProvider}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link target="_blank" href={`/admin/patients/${patient.id}/appointments`}>
                      <CalendarDays className="h-4 w-4" />
                      Appointments
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link href={`/admin/patients/${patient.id}`}>
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      openDeleteDialog({
                        id: patient.id,
                        description: patient.name,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
