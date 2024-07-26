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
import { useRef } from "react";
import { useFormState } from "react-dom";

const initialState = { message: "" };

export default function LoginPage() {
  const [state, formAction] = useFormState(loginAdmin, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <main className="w-[600px] mx-auto py-12 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold">Login</h1>
      </header>
      {state.message && <p>{state.message}</p>}
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={form.handleSubmit(() => {
            formAction(new FormData(formRef.current!));
          })}
          className="space-y-6"
        >
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
