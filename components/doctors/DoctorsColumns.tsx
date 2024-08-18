"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { getImageLink } from "@/lib/actions/getImageLink";
import { DoctorDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { ColumnDef } from "@tanstack/react-table";
import { CalendarDays, ImageIcon, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type onDeleteFunction = (doctor: DoctorDocumentSchema) => void;

export function DoctorsColumns(onDeleteClick: onDeleteFunction): ColumnDef<DoctorDocumentSchema>[] {
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
      accessorKey: "pictureId",
      header: "Picture",
      cell: ({ getValue }) => {
        const pictureId = getValue() as string;
        if (pictureId) {
          return (
            <Image
              alt="doctor picture"
              className="aspect-square rounded-md object-cover"
              height="64"
              src={getImageLink(pictureId)}
              width="64"
            />
          );
        } else {
          return (
            <div className="flex h-16 w-16 items-center justify-center">
              <ImageIcon className="h-10 w-10" />
            </div>
          );
        }
      },
      meta: {
        cellClassName: "hidden md:table-cell",
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "specialty",
      header: "Specialty",
    },
    {
      accessorKey: "bio",
      header: "Biography",
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
              <Link target="_blank" href={`/admin/doctors/${row.original.$id}/slots`}>
                <CalendarDays className="mr-2 h-3.5 w-3.5" />
                Slots
              </Link>
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDeleteClick(row.original)}>
              <Trash2 className="mr-2 h-3.5 w-3.5" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];
}
