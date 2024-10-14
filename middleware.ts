import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccount } from "@/lib/appwrite/nodeSessionClient";

export async function middleware(request: NextRequest) {
  try {
    const account = getAccount();
    const user = await account.get();
    if (!user.labels.includes("admin")) throw new Error("User is not admin");
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return;
}

// Matches every /admin path except for /admin/login
export const config = {
  matcher: "/admin((?!/login$).*)",
};
