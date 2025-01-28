"use client";

import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/forms/ErrorMessage";
import TextField from "@/components/forms/TextField";
import PasswordField from "@/components/forms/PasswordField";
import SubmitButton from "@/components/forms/SubmitButton";
import { login } from "@/server/actions/login";
import { objectToFormData } from "@/lib/utils";
import { displayError } from "@/server/config/errors";
import { loginSchema } from "@/server/adapters/zod/loginValidator";
import { z } from "zod";
import { TestLoginForm } from "@/components/testing/TestLoginForm";

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const [fetching, setFetching] = useState(false);
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
    setFetching(true);
    try {
      const result = await login(objectToFormData(data));

      if (!result.ok) {
        setMessage(displayError(result));
        return;
      }

      await router.push("/admin");
    } catch (error) {
      console.log(error);
      setMessage(displayError());
    } finally {
      setFetching(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <ErrorMessage message={message} />
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3" ref={formRef}>
          <TextField
            form={form}
            name="email"
            label="Email"
            placeholder="name@example.com"
            readonly={fetching}
          />
          <PasswordField form={form} name="password" label="Password" readonly={fetching} />
          <SubmitButton form={form} label="Submit" disabled={fetching} />
        </form>
      </Form>
      <TestLoginForm form={form} formRef={formRef} />
    </>
  );
}
