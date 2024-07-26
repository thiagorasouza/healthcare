import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  CircleUser,
  CreditCard,
  DollarSign,
  Menu,
  Search,
  User,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden shrink-0 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <Image
              src="/images/logo.svg"
              alt="Mednow logo"
              className="grayscale"
              width={32}
              height={32}
            />
            <span className="hidden lg:block">Mednow</span>
          </Link>
          <Separator orientation="vertical" className="h-5" />
          <ul className="flex flex-row gap-6">
            <li>
              <Link
                href="#"
                className="text-foreground transition-colors hover:text-foreground"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Doctors
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Patients
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Appointments
              </Link>
            </li>
          </ul>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <nav className="space-y-5 text-lg font-medium">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <Image
                  src="/images/logo.svg"
                  alt="Mednow logo"
                  className="grayscale"
                  width={32}
                  height={32}
                />
                Mednow
              </Link>
              <Separator orientation="horizontal" />
              <ul className="flex flex-col gap-6">
                <li>
                  <Link
                    href="#"
                    className="text-foreground transition-colors hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Doctors
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Patients
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Appointments
                  </Link>
                </li>
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <form className="ml-auto flex-1 sm:flex-initial">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search doctor or patient"
                className="pl-8 sm:w-full md:w-[200px] lg:w-[300px]"
              />
            </div>
          </form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Change Password
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer hover:bg-muted">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+189</div>
              <p className="text-xs text-muted-foreground">
                +5.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Appointments
              </CardTitle>
              <CalendarCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+210</div>
              <p className="text-xs text-muted-foreground">
                +18.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Payments</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+ U$ 1,532</div>
              <p className="text-xs text-muted-foreground">
                +9% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Doctors</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">32</div>
              <p className="text-xs text-muted-foreground">
                +2 since last month
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Appointments</CardTitle>
                <CardDescription>
                  Recent appointments scheduled.
                </CardDescription>
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
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">2024-07-20</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>JL</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Jackson Lee
                  </p>
                  <p className="text-sm text-muted-foreground">
                    jackson.lee@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">2024-07-21</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Isabella Nguyen
                  </p>
                  <p className="text-sm text-muted-foreground">
                    isabella.nguyen@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">2024-07-22</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>WK</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    William Kim
                  </p>
                  <p className="text-sm text-muted-foreground">
                    will@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">2024-07-23</div>
              </div>
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/05.png" alt="Avatar" />
                  <AvatarFallback>SD</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Sofia Davis
                  </p>
                  <p className="text-sm text-muted-foreground">
                    sofia.davis@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">2024-07-24</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
