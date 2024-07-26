"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { useRef, useState } from "react";
import { unexpectedError } from "@/lib/results";

export default function LoginPage() {
  const [message, setMessage] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(loginData: LoginData) {
    setMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const result = await loginAdmin(loginData);
      setMessage(result.message);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setMessage(unexpectedError().message);
    }
  }

  console.log("isSubmitting", form.formState.isSubmitting);

  return (
    <main className="w-[600px] mx-auto py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Login</h1>
      </header>
      {message && <p>{message}</p>}
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    data-cy="email"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
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
                  <Input
                    type="password"
                    data-cy="password"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormMessage data-cy="passwordError" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            data-cy="submit"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </main>
  );
}
