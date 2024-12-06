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
import { sendConfirmation } from "@/server/actions/sendConfirmation";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { useState } from "react";
import { toast } from "sonner";

const emailSchema = z.object({
  email: z
    .string()
    .email({ message: "Please type a valid email address." })
    .refine((email) => !email.match(/fake\_/gi), {
      message: "Unable to send confirmation to fake emails.",
    }),
});

type EmailData = z.infer<typeof emailSchema>;

const errorMsg =
  "The server was not able to send the confirmation to your email. Please try again later";

export default function SendEmailDialog({ appointmentId }: { appointmentId: string }) {
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: EmailData) {
    try {
      const { email } = data;

      const result = await sendConfirmation(
        objectToFormData({
          email,
          appointmentId,
        }),
      );

      if (!result.ok) {
        toast(errorMsg);
        return;
      }

      toast(`Email successfully sent to ${email}`);
    } catch (error) {
      console.log(error);
      toast(errorMsg);
    } finally {
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow">
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
