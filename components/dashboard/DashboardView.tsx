"use client";

import Link from "next/link";
import { Activity, ArrowUpRight, CalendarCheck, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import DashboardStatsCard from "@/components/dashboard/DashboardStatsCard";

export default function DashboardView() {
  return (
    <div className="space-y-4 md:space-y-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <DashboardStatsCard
          title="Doctor"
          stats="32"
          growth="+2 since last month"
          Icon={Activity}
          href="/admin/doctors"
        />
        <DashboardStatsCard
          title="Patients"
          stats="189"
          growth="+5.1% from last month"
          Icon={Users}
          href="/admin/patients"
        />
        <DashboardStatsCard
          title="Appointments"
          stats="210"
          growth="+18.1% from last month"
          Icon={CalendarCheck}
          href="/admin/appointments"
        />
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
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
        <Card>
          <CardHeader>
            <CardTitle>Recent Patients</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Olivia Martin</p>
                <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
              </div>
              <div className="ml-auto font-medium">2024-07-20</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">jackson.lee@email.com</p>
              </div>
              <div className="ml-auto font-medium">2024-07-21</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/03.png" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Isabella Nguyen</p>
                <p className="text-sm text-muted-foreground">isabella.nguyen@email.com</p>
              </div>
              <div className="ml-auto font-medium">2024-07-22</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/04.png" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">2024-07-23</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">sofia.davis@email.com</p>
              </div>
              <div className="ml-auto font-medium">2024-07-24</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
