"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllDoctors } from "@/lib/actions/getAllDoctors";
import { getImageLink } from "@/lib/actions/getImageLink";
import {
  DoctorDocumentListSchema,
  DoctorDocumentSchema,
} from "@/lib/schemas/appwriteSchema";
import { abbreviateText, getRandomPictureURL } from "@/lib/utils";
import {
  ImageIcon,
  PlusCircle,
  Trash,
  Trash2,
  User,
  UserPen,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function DoctorsPage() {
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState<DoctorDocumentSchema[]>();

  useEffect(() => {
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
  }, []);

  return (
    <>
      <Button size="sm" className="ml-auto h-8 w-fit">
        <Link href="/admin/doctors/create" className="flex items-center gap-2">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sm:whitespace-nowrap">Add Doctor</span>
        </Link>
      </Button>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Doctors</CardTitle>
          <CardDescription>
            Manage doctors and adjust their availabilities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            "Loading..."
          ) : doctors ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Picture</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Specialty</TableHead>
                  <TableHead>Biography</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {doctors.map((doctor: DoctorDocumentSchema, index: number) => {
                  return (
                    <TableRow key={index}>
                      <TableCell className="">
                        {doctor.pictureId ? (
                          <Image
                            alt={`${doctor.name} picture`}
                            className="aspect-square rounded-md object-cover"
                            height="64"
                            src={getImageLink(doctor.pictureId)}
                            width="64"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center">
                            <ImageIcon className="h-10 w-10" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">
                        {doctor.name}
                      </TableCell>
                      <TableCell>{doctor.specialty}</TableCell>
                      <TableCell>{abbreviateText(doctor.bio, 50)}</TableCell>
                      <TableCell>
                        <Button variant="outline" className="mr-2">
                          <Link
                            href={`/admin/doctors/update/${doctor.$id}`}
                            className="flex items-center"
                          >
                            <UserPen className="h-5 w-5" />
                          </Link>
                        </Button>
                        <Button variant="outline">
                          <Link
                            href={`/admin/doctors/delete/${doctor.$id}`}
                            className="flex items-center"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            "Not doctors found"
          )}
        </CardContent>
      </Card>
    </>
  );
}
