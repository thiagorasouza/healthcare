import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { landingNavbarLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ChevronRight, House } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="md:hidden">
          <Image src="/img/menu.svg" width={36} height={36} alt="menu icon" />
        </button>
      </SheetTrigger>
      <SheetContent className="px-8 pt-7" side="left">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold">
            <div className="flex items-center gap-3">
              <Image src="/img/logo.png" alt="heartbeat logo" width={36} height={36} />
              <h2 className="text-2xl font-semibold">Mednow</h2>
            </div>
          </SheetTitle>
          <SheetDescription>
            <ul className="flex flex-col items-start gap-6 pt-6 text-lg font-medium">
              {landingNavbarLinks.map((link, index) => (
                <li key={index}>
                  <Link href={link.href} className="flex items-center gap-2">
                    <ChevronRight className="h-5 w-5" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
