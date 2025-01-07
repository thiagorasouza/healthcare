"use client";

import { Form } from "@/components/ui/form";
import { unexpectedError } from "@/lib/results";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormMessage from "@/components/forms/FormMessage";
import TextField from "@/components/forms/TextField";
import PasswordField from "@/components/forms/PasswordField";
import SubmitButton from "@/components/forms/SubmitButton";
import TestLoginAsTestUser from "@/components/testing/TestLoginAsAdmin";
import { login } from "@/server/actions/login";
import { objectToFormData } from "@/lib/utils";
import { displayError } from "@/server/config/errors";
import { loginSchema } from "@/server/adapters/zod/loginValidator";
import { z } from "zod";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
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

  async function onSubmit(data: LoginData) {
    setMessage("");
    try {
      const result = await login(objectToFormData(data));
      console.log("🚀 ~ result:", result);
      if (result.ok) {
        router.push("/admin");
        return;
      }

      const error = displayError(result);
      console.log("🚀 ~ error:", error);
      setMessage(error);
    } catch (error) {
      console.log(error);
      setMessage(unexpectedError().message);
    }
  }

  return (
    <>
      <Form {...form}>
        <FormMessage message={message} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" ref={formRef}>
          <TextField form={form} name="email" label="Email" placeholder="name@example.com" />
          <PasswordField form={form} name="password" label="Password" />
          <SubmitButton form={form} label="Submit" />
        </form>
      </Form>
      {/* <TestLoginAsTestUser form={form} formRef={formRef} /> */}
    </>
  );
}
