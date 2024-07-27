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
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Mock data for doctors
const doctorsData = [
  {
    picture:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&h=400&fit=crop",
    name: "Dr. Cassandra Smith",
    specialty: "Cardiologist",
    biography:
      "Dr. Cassandra is a cardiologist with over 15 years of experience...",
  },
  {
    picture: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Dr. Michael Johnson",
    specialty: "Neurologist",
    biography:
      "Dr. Michael specializes in neurological disorders and treatments...",
  },
  {
    picture:
      "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&h=400&fit=crop",
    name: "Dr. Emma Brown",
    specialty: "Dermatologist",
    biography:
      "Dr. Emma is known for her expertise in skin health and treatments...",
  },
  {
    picture: "https://randomuser.me/api/portraits/men/44.jpg",
    name: "Dr. Robert Davis",
    specialty: "Pediatrician",
    biography:
      "Dr. Robert has a passion for child healthcare and well-being...",
  },
  {
    picture: "https://randomuser.me/api/portraits/women/50.jpg",
    name: "Dr. Sophia Martinez",
    specialty: "Orthopedic Surgeon",
    biography: "Dr. Sophia excels in treating musculoskeletal system issues...",
  },
  {
    picture: "https://randomuser.me/api/portraits/men/54.jpg",
    name: "Dr. William Garcia",
    specialty: "Oncologist",
    biography:
      "Dr. William is dedicated to cancer treatment and patient care...",
  },
];

export default async function DoctorsPage() {
  const result = await getAllDoctors();
  const doctors = result?.data as any;
  console.log("🚀 ~ doctors:", doctors);

  const maxLength = 50;
  function abbreviateText(text: string): string {
    if (text.length <= maxLength) {
      return text;
    }

    const truncated = text.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(" ");

    if (lastSpaceIndex > -1) {
      return text.substring(0, lastSpaceIndex) + " (...)";
    }

    return truncated + " (...)";
  }

  function getRandomPictureURL() {
    const gendersList = ["men", "women"];
    const gender = gendersList[Math.floor(Math.random() * gendersList.length)];
    const number = Math.floor(Math.random() * 91);
    return `https://randomuser.me/api/portraits/${gender}/${number}.jpg`;
  }

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
                    <TableCell>{abbreviateText(doctor.bio)}</TableCell>
                    <TableCell>
                      <Button variant="outline" className="mr-2">
                        Update
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
