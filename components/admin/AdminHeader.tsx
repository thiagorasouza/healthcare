"use client";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import AccountDropdown from "@/components/admin/AdminAccountDropdown";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { adminNavbarLinks } from "@/lib/constants";

export function AdminHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-10 flex h-16 w-full items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden shrink-0 font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/" className="flex items-center gap-2 text-base font-semibold">
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
          {adminNavbarLinks.map((link, index) => (
            <li key={index}>
              <Link
                href={link.href}
                className={cn(
                  "text-muted-foreground transition-colors hover:text-foreground",
                  pathname === link.href && "text-foreground",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
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
              {adminNavbarLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-muted-foreground transition-colors hover:text-foreground",
                      pathname === link.href && "text-foreground",
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
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
        <AccountDropdown />
      </div>
    </header>
  );
}
