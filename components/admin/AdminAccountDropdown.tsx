"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CircleUser } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { logout } from "@/server/actions/logout.bypass";
import { displayError } from "@/server/config/errors";
// import { logout } from "@/lib/actions/logout";

export default function AdminAccountDropdown() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const logoutResult = await logout();
      toast("Logged out.");
      router.push("/admin/login");
    } catch (error) {
      console.log(error);
      toast.warning(displayError());
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <CircleUser className="h-5 w-5" />
          <span className="sr-only">Toggle user menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {/* <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-muted">
          Change Password
        </DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer hover:bg-muted" onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
