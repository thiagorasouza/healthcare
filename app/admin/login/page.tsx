"use client";

import Image from "next/image";
import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <main className="flex">
      <aside className="flex-1 min-h-screen bg-zinc-900 p-8 hidden lg:block">
        <div className="flex items-center gap-2">
          <Image
            src="/images/logo.svg"
            alt="Mednow logo"
            width={32}
            height={32}
          />
          <h1 className="text-white text-lg font-semibold">Mednow</h1>
        </div>
      </aside>
      <section className="flex-1 flex items-center justify-center min-h-screen p-8">
        <div className="max-w-[400px] w-full space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Login</h1>
            <p className="text-sm">to the admin dashboard</p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
