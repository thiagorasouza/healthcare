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

export default function DashboardAppointmentsCard() {
  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Appointments</CardTitle>
          <CardDescription>Recent appointments scheduled.</CardDescription>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Price</TableHead>
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
            <TableRow>
              <TableCell>
                <div className="font-medium">Dr. Emily Davis</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  emilydavis@example.com
                </div>
              </TableCell>
              <TableCell>Sarah Brown</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">
                  Confirmed
                </Badge>
              </TableCell>
              <TableCell>2023-07-02</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Dr. Michael Lee</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  michaellee@example.com
                </div>
              </TableCell>
              <TableCell>David Wilson</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">
                  Confirmed
                </Badge>
              </TableCell>
              <TableCell>2023-07-03</TableCell>
              <TableCell>$300.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Dr. Sarah Johnson</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  sarahjohnson@example.com
                </div>
              </TableCell>
              <TableCell>James Smith</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">
                  Confirmed
                </Badge>
              </TableCell>
              <TableCell>2023-07-04</TableCell>
              <TableCell>$350.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <div className="font-medium">Dr. Karen White</div>
                <div className="hidden text-sm text-muted-foreground md:inline">
                  karenwhite@example.com
                </div>
              </TableCell>
              <TableCell>Emily Harris</TableCell>
              <TableCell>
                <Badge className="text-xs" variant="outline">
                  Confirmed
                </Badge>
              </TableCell>
              <TableCell>2023-07-05</TableCell>
              <TableCell>$400.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
