"use server";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { abbreviateText, getRandomPictureURL } from "@/lib/utils";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function DoctorsPage() {
  const result = await getAllDoctors();
  const doctors = result?.data as any;
  // console.log("🚀 ~ doctors:", doctors);

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
              {doctors.map((doctor: any, index: number) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Image
                        alt={`${doctor.name} picture`}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={getRandomPictureURL()}
                        width="64"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{doctor.name}</TableCell>
                    <TableCell>{doctor.specialty}</TableCell>
                    <TableCell>{abbreviateText(doctor.bio, 50)}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-2">
                        <Link href={`/admin/doctors/update/${doctor.$id}`}>
                          Update
                        </Link>
                      </Button>
                      <Button variant="destructive">Delete</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing a total of <strong>{doctors.length}</strong> doctors
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
