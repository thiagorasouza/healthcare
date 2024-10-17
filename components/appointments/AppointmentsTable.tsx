"use client";

import { AppointmentModel } from "@/server/domain/models/appointmentModel";
import { Badge } from "@/components/ui/badge";
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
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

interface AppointmentTableProps {
  appointments?: AppointmentModel[] | "error";
}

export default function AppointmentsTable({ appointments }: AppointmentTableProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row space-y-0">
        <div className="grid gap-2">
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Recently scheduled appointments</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto">
          <Link href="#">
            View All
            <ArrowUpRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Duration</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="font-medium">Dr. John Smith</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  johnsmith@example.com
                </div>
              </TableCell>
              <TableCell>Michael Johnson</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">
                  Confirmed
                </Badge>
              </TableCell>
              <TableCell>2023-07-01</TableCell>
              <TableCell>$200.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
