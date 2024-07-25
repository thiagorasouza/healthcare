"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginAdmin } from "./loginAdmin";
import { loginSchema } from "./loginSchema";
import { LoginData } from "./loginData";

export default function LoginPage() {
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: LoginData) {
    // console.log(values);
    const result = await loginAdmin(values);
    console.log("🚀 ~ result:", result);
  }

  return (
    <main className="w-[600px] mx-auto py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Login</h1>
      </header>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input data-cy="email" {...field} />
                </FormControl>
                <FormMessage data-cy="emailError" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" data-cy="password" {...field} />
                </FormControl>
                <FormMessage data-cy="passwordError" />
              </FormItem>
            )}
          />
          <Button type="submit" data-cy="submit">
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
