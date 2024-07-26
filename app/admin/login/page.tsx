"use client";

import LoginForm from "./loginForm";

export default function LoginPage() {
  return (
    <main className="w-[600px] mx-auto py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Login</h1>
      </header>
      <LoginForm />
    </main>
  );
}
