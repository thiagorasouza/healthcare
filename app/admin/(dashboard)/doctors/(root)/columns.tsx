"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getImageLink } from "@/lib/actions/getImageLink";
import { DoctorDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { ColumnDef } from "@tanstack/react-table";
import { ImageIcon, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type onDeleteFunction = (name: string, doctorId: string, authId: string) => void;

export function columns(onDelete: onDeleteFunction): ColumnDef<DoctorDocumentSchema>[] {
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Link target="_blank" href={`/admin/doctors/update/${row.original.$id}`}>
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onDelete(row.original.name, row.original.$id, row.original.authId)}
              >
                Delete
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link target="_blank" href={`/admin/doctors/${row.original.$id}/availabilities`}>
                  Availabilities
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
