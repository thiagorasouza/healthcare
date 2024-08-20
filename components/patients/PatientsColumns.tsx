"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { PatientStoredData } from "@/lib/schemas/patientsSchema";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, SquarePen, Trash2 } from "lucide-react";
import Link from "next/link";

type onDeleteFunction = (patient: PatientStoredData) => void;

export function PatientsColumns(onDeleteClick: onDeleteFunction): ColumnDef<PatientStoredData>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      meta: {
        cellClassName: "hidden lg:table-cell",
      },
    },
    {
      accessorKey: "insuranceProvider",
      header: "Insurance",
      meta: {
        cellClassName: "hidden lg:table-cell",
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-3">
            <Button size="sm" variant="outline" asChild>
              <Link target="_blank" href={`/admin/patients/${row.original.$id}/appointments`}>
                <CalendarDays className="h-3.5 w-3.5 md:mr-2" />
                <span className="hidden md:inline">Appointments</span>
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link target="_blank" href={`/admin/patients/${row.original.$id}/update`}>
                <SquarePen className="h-3.5 w-3.5 md:mr-2" />
                <span className="hidden md:inline">Edit</span>
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDeleteClick(row.original)}>
              <Trash2 className="h-3.5 w-3.5 md:mr-2" />
              <span className="hidden md:inline">Delete</span>
            </Button>
          </div>
        );
      },
    },
  ];
}
