"use client";

import Image from "next/image";
import LoginForm from "./loginForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon } from "@radix-ui/react-icons";

export default function LoginPage() {
  return (
    <main className="flex">
      <div className="relative flex-1 flex flex-col p-8 min-h-screen items-center justify-center">
        <Button
          variant="ghost"
          className="absolute top-0 left-0 ml-8 mt-6 text-sm"
        >
          <Link href="/" className="flex items-center">
            <HomeIcon className="w-4 h-4 mr-2" /> Home
          </Link>
        </Button>
        <section className="max-w-[400px] w-full space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">to the admin dashboard</p>
          </div>
          <LoginForm />
        </section>
      </div>
      <aside className="relative flex-1 min-h-screen bg-zinc-900 hidden lg:block">
        <h1 className="absolute top-0 right-0 m-8 text-white text-lg font-semibold">
          Mednow
        </h1>
        <Image
          src="/images/side.png"
          alt="hospital building"
          width={720}
          height={1080}
          className="w-full h-screen object-cover brightness-[0.2] grayscale"
        />
      </aside>
    </main>
  );
}
