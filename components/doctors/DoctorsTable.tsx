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
import { getImageLink } from "@/lib/actions/getImageLink";
import { useDeleteDialog } from "@/lib/hooks/useDeleteDialog";
import { deleteDoctor } from "@/server/actions/deleteDoctor.bypass";
import { listDoctors } from "@/server/actions/listDoctors.bypass";
import { displayError } from "@/server/config/errors";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { CalendarDays, PlusCircle, SquarePen, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DoctorsTable() {
  const { openDeleteDialog, deleteDialog } = useDeleteDialog(handleDelete);
  const [doctors, setDoctors] = useState<DoctorModel[] | "error">();

  const loading = doctors === undefined;
  const error = doctors === "error";
  const empty = doctors?.length === 0;

  async function loadDoctors() {
    try {
      const result = await listDoctors();
      if (!result.ok) {
        setDoctors("error");
      } else {
        setDoctors(result.value);
      }
    } catch (error) {
      console.log(error);
      setDoctors("error");
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  async function handleDelete(id: string) {
    try {
      const deleteResult = await deleteDoctor(objectToFormData({ id }));
      if (!deleteResult.ok) {
        toast(displayError(deleteResult));
        return;
      }

      toast(`Doctor deleted successfully.`);
      loadDoctors();
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
        <p>No doctors yet.</p>
        <Button asChild className="mt-6">
          <Link href="/admin/doctors/create">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create
          </Link>
        </Button>
      </>
    );
  } else if (error) {
    return <ErrorCard text="Unable to query for doctors at this time. Please try again later." />;
  }

  return (
    <>
      {deleteDialog}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Picture</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Specialty</TableHead>
            <TableHead>Biography</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {doctors.map((doctor) => (
            <TableRow key={doctor.id}>
              <TableCell>
                <Image
                  alt="doctor picture"
                  className="aspect-square rounded-md object-cover"
                  height="64"
                  src={getImageLink(doctor.pictureId)}
                  width="64"
                />
              </TableCell>
              <TableCell>{doctor.name}</TableCell>
              <TableCell>{doctor.specialty}</TableCell>
              <TableCell>{doctor.bio}</TableCell>
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/admin/doctors/${doctor.id}`}>
                      <SquarePen className="h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() =>
                      openDeleteDialog({
                        id: doctor.id,
                        description: doctor.name,
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
