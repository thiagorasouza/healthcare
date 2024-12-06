"use client";

import { Form } from "@/components/ui/form";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { objectToFormData } from "@/lib/utils";
import { DoctorData, DoctorDataUpdate, doctorsSchema } from "@/lib/schemas/doctorsSchema";
import { Error, Result, unexpectedError } from "@/lib/results";
import PictureField from "@/components/forms/PictureField";
import TextField from "@/components/forms/TextField";
import TextareaField from "@/components/forms/TextareaField";
import SubmitButton from "@/components/forms/SubmitButton";

import { currentPictureName } from "@/lib/constants";
import FormMessage from "@/components/forms/FormMessage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import TestDoctorFillWithRandomData from "@/components/testing/TestDoctorFillWithRandomData";
import { env } from "@/lib/env";
import { getFileLink } from "@/lib/actions/getFileLink";

interface DoctorsFormProps {
  title: string;
  description: string;
  doctorData?: DoctorDataUpdate;
  action: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}

export default function DoctorsForm({ title, description, doctorData, action }: DoctorsFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<DoctorData>({
    resolver: zodResolver(doctorsSchema),
    defaultValues: {
      name: doctorData?.name || "",
      email: doctorData?.email || "",
      phone: doctorData?.phone || "",
      specialty: doctorData?.specialty || "",
      bio: doctorData?.bio || "",
      picture: undefined,
    },
  });

  useEffect(() => {
    if (!doctorData?.pictureId) return;

    const asyncEffect = async () => {
      const pictureUrl = getFileLink(env.imagesBucketId, doctorData?.pictureId);
      const response = await fetch(pictureUrl);
      const blob = await response.blob();
      form.setValue("picture", new File([blob], currentPictureName, { type: "image/jpeg" }), {
        shouldValidate: true,
      });
    };

    asyncEffect();
  }, [doctorData, form]);

  async function onSubmit(data: any) {
    setMessage("");
    try {
      const formData = objectToFormData(data);
      if (doctorData?.doctorId && doctorData?.authId) {
        formData.append("doctorId", doctorData.doctorId);
        formData.append("authId", doctorData.authId);
      }

      const result = await action(formData);
      if (result.success) {
        router.push("/admin/doctors");
        return;
      }
      setMessage(result.message);
    } catch (error) {
      console.log(error);
      setMessage(unexpectedError().message);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <FormMessage message={message} />
          <form
            onSubmit={form.handleSubmit(onSubmit, () => console.log(form.formState.errors))}
            className="flex flex-col gap-3 md:gap-6"
            ref={formRef}
          >
            <div className="flex items-center gap-3 md:gap-5">
              <PictureField form={form} />
              <TextField
                form={form}
                name="name"
                label="Name"
                placeholder="Your name"
                description="Should not include title (Dr., Mr., Mrs., etc.)"
              />
            </div>
            <TextField
              form={form}
              name="specialty"
              label="Specialty"
              placeholder="Cardiology, Orthopedist..."
              description="Medical specialty"
            />
            <TextareaField
              form={form}
              name="bio"
              label="Biography"
              placeholder="Short medical experience and training description"
            />
            <fieldset className="rounded-lg border p-5 pt-3">
              <legend className="-ml-1 px-1 text-sm font-medium text-muted-foreground">User</legend>
              <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                <TextField
                  form={form}
                  name="email"
                  label="Email"
                  placeholder="name@example.com"
                  description="This will be used for the login"
                />
                <TextField
                  form={form}
                  name="phone"
                  label="Phone"
                  placeholder="+351 000 000 000"
                  description="Must include country code"
                />
              </div>
            </fieldset>
            <SubmitButton form={form} label="Submit" />
            <TestDoctorFillWithRandomData form={form} formRef={formRef} />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
