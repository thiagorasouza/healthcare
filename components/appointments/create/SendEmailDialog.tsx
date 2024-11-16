"use client";

import SubmitButton from "@/components/forms/SubmitButton";
import TextField from "@/components/forms/TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please type a valid email address." })
    .refine((email) => !email.match(/fake\_/gi), {
      message: "Unable to send confirmation to fake emails.",
    }),
});

export default function SendEmailDialog() {
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
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Mail />
          Send via email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Send via email</DialogTitle>
          <DialogDescription>Send the appointment confirmation to your email</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <TextField
              icon={<Mail className="h-4 w-4" />}
              form={form}
              name="email"
              description="Please don't spam. Send emails only to real mail boxes"
            />
            <DialogFooter className="">
              <SubmitButton form={form} label="Send" />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
