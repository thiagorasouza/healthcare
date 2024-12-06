"use client";

import { Form } from "@/components/ui/form";
import { unexpectedError } from "@/lib/results";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginData, loginSchema } from "@/lib/schemas/loginSchema";
import { loginAdmin } from "@/lib/actions/loginAdmin";
import AlertMessage from "@/components/forms/AlertMessage";
import TextField from "@/components/forms/TextField";
import PasswordField from "@/components/forms/PasswordField";
import SubmitButton from "@/components/forms/SubmitButton";
import TestLoginAsAdmin from "@/components/testing/TestLoginAsAdmin";

export default function AdminLoginForm() {
  const router = useRouter();
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
      const result = await loginAdmin(loginData);
      console.log("🚀 ~ result:", result);
      if (result.success) {
        router.push("/admin");
        return;
      }

      setMessage(result.message);
    } catch (error) {
      console.log(error);
      setMessage(unexpectedError().message);
    }
  }

  return (
    <>
      <Form {...form}>
        <AlertMessage message={message} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" ref={formRef}>
          <TextField form={form} name="email" label="Email" placeholder="name@example.com" />
          <PasswordField form={form} name="password" label="Password" />
          <SubmitButton form={form} label="Submit" />
        </form>
      </Form>
      <TestLoginAsAdmin form={form} formRef={formRef} />
    </>
  );
}
