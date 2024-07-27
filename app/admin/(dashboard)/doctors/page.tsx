import { Badge } from "@/components/ui/badge";
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
import Image from "next/image";

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

export default function DoctorsPage() {
  return (
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
            {doctorsData.map((doctor, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Image
                    alt={`${doctor.name} picture`}
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={doctor.picture}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{doctor.name}</TableCell>
                <TableCell>{doctor.specialty}</TableCell>
                <TableCell>{doctor.biography}</TableCell>
                <TableCell>
                  <Button variant="outline" className="mr-2">
                    Update
                  </Button>
                  <Button variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-6</strong> of <strong>6</strong> doctors
        </div>
      </CardFooter>
    </Card>
  );
}
