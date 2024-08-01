"use client";

import { columns } from "@/app/admin/(dashboard)/doctors/(root)/columns";
import { DataTable } from "@/app/admin/(dashboard)/doctors/(root)/data-table";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteDoctor } from "@/lib/actions/deleteDoctor";
import { getAllDoctors } from "@/lib/actions/getAllDoctors";
import { getImageLink } from "@/lib/actions/getImageLink";
import { DoctorDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { abbreviateText } from "@/lib/utils";
import { ImageIcon, PlusCircle, Trash2, UserPen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function DoctorsPage() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorDocumentSchema[]>();

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

  async function onDelete(name: string, doctorId: string, authId: string) {
    try {
      const result = await deleteDoctor(doctorId, authId);
      // console.log("🚀 ~ result:", result);
      if (result.success) {
        toast(`Doctor ${name} deleted successfully.`);
        setLoading(true);
      }
    } catch (error) {
      toast(`Unable to delete doctor ${name}`);
    }
  }

  return (
    <>
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
            <DataTable columns={columns(onDelete)} data={doctors} />
          ) : (
            // <Table>
            //   <TableHeader>
            //     <TableRow>
            //       <TableHead className="hidden md:table-cell">
            //         Picture
            //       </TableHead>
            //       <TableHead>Name</TableHead>
            //       <TableHead className="max-sm:hidden">Specialty</TableHead>
            //       <TableHead className="hidden lg:table-cell">
            //         Biography
            //       </TableHead>
            //       <TableHead>Actions</TableHead>
            //     </TableRow>
            //   </TableHeader>
            //   <TableBody>
            //     {doctors.map((doctor: DoctorDocumentSchema, index: number) => {
            //       return (
            //         <TableRow key={index}>
            //           <TableCell className="hidden md:table-cell">
            //             {doctor.pictureId ? (
            //               <Image
            //                 alt={`${doctor.name} picture`}
            //                 className="aspect-square rounded-md object-cover"
            //                 height="64"
            //                 src={getImageLink(doctor.pictureId)}
            //                 width="64"
            //               />
            //             ) : (
            //               <div className="flex h-16 w-16 items-center justify-center">
            //                 <ImageIcon className="h-10 w-10" />
            //               </div>
            //             )}
            //           </TableCell>
            //           <TableCell className="font-medium">
            //             {doctor.name}
            //           </TableCell>
            //           <TableCell className="max-sm:hidden">
            //             {doctor.specialty}
            //           </TableCell>
            //           <TableCell className="hidden lg:table-cell">
            //             {abbreviateText(doctor.bio, 50)}
            //           </TableCell>
            //           <TableCell className="flex items-center">
            //             <Button variant="outline">
            //               <Link
            //                 href={`/admin/doctors/update/${doctor.$id}`}
            //                 className="flex items-center"
            //               >
            //                 <UserPen className="h-4 w-4 sm:h-5 sm:w-5" />
            //               </Link>
            //             </Button>
            //             <Button
            //               variant="outline"
            //               className="sm:block"
            //               onClick={() =>
            //                 onDelete(doctor.name, doctor.$id, doctor.authId)
            //               }
            //             >
            //               <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
            //             </Button>
            //           </TableCell>
            //         </TableRow>
            //       );
            //     })}
            //   </TableBody>
            // </Table>
            "Not doctors found"
          )}
        </CardContent>
      </Card>
    </>
  );
}
