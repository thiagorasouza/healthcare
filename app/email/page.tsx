"use client";

import SubmitButton from "@/components/forms/SubmitButton";
import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

export default function EmailPage() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
  }

  return (
    <div className="flex max-w-xl items-center p-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextField form={form} label="Email" name="email" />
          <SubmitButton form={form} label="Send email" />
        </form>
      </Form>
    </div>
  );
}
