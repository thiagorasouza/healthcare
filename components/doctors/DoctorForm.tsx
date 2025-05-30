"use client";

import PictureField from "@/components/forms/PictureField";
import SubmitButton from "@/components/forms/SubmitButton";
import TextareaField from "@/components/forms/TextareaField";
import TextField from "@/components/forms/TextField";
import { ErrorDialog } from "@/components/shared/ErrorDialog";
import { TestingOption } from "@/components/testing/TestingOption";
import { Form } from "@/components/ui/form";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getRandomDoctorSpecialty } from "@/lib/utils";
import { createDoctor } from "@/server/actions/createDoctor";
import { updateDoctor } from "@/server/actions/updateDoctor";
import { DoctorFormData, doctorsFormSchema } from "@/server/adapters/zod/doctorValidator";
import { currentPictureName } from "@/server/config/constants";
import { displayError } from "@/server/config/errors";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { objectToFormData } from "@/server/useCases/shared/helpers/utils";
import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface CreateDoctorFormProps {
  mode: "create";
  doctor?: undefined;
}

export interface UpdateDoctorFormProps {
  mode: "update";
  doctor: DoctorModel;
}

export default function DoctorForm({
  doctor,
  mode,
}: CreateDoctorFormProps | UpdateDoctorFormProps) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const form = useForm<DoctorFormData>({
    resolver: zodResolver(doctorsFormSchema),
    defaultValues: {
      name: doctor?.name || "",
      email: doctor?.email || "",
      phone: doctor?.phone || "",
      specialty: doctor?.specialty || "",
      bio: doctor?.bio || "",
      picture: undefined,
    },
  });

  useEffect(() => {
    if (!doctor?.pictureId) return;

    const asyncEffect = async () => {
      const pictureUrl = getImageLink(doctor.pictureId);
      const response = await fetch(pictureUrl);
      const blob = await response.blob();
      form.setValue("picture", new File([blob], currentPictureName, { type: "image/jpeg" }), {
        shouldValidate: true,
      });
    };

    asyncEffect();
  }, [doctor, form]);

  async function onSubmit(data: DoctorFormData) {
    setMessage("");
    const formData = objectToFormData(data);
    try {
      if (mode === "create") {
        const createResult = await createDoctor(formData);
        if (!createResult.ok) {
          setMessage(displayError(createResult));
          return;
        }
        toast("Doctor created.");
      } else if (mode === "update") {
        formData.append("id", doctor.id);
        const updateResult = await updateDoctor(formData);
        if (!updateResult.ok) {
          setMessage(displayError(updateResult));
          return;
        }
        toast("Doctor updated.");
      }
      router.push("/admin/doctors");
    } catch (error) {
      console.log(error);
      setMessage(displayError());
    }
  }

  async function fillWithTestingData() {
    form.setValue("name", faker.person.firstName() + " " + faker.person.lastName(), {
      shouldValidate: true,
    });
    const picture = await fetch(faker.image.avatarGitHub()).then((response) => response.blob());
    form.setValue("picture", new File([picture], "randomPicture.png", { type: "image/png " }), {
      shouldValidate: true,
    });
    form.setValue("specialty", getRandomDoctorSpecialty(), { shouldValidate: true });
    form.setValue("bio", faker.lorem.paragraph(2), { shouldValidate: true });
    form.setValue("email", faker.internet.email(), { shouldValidate: true });
    form.setValue("phone", faker.helpers.fromRegExp("+3519[0-9]{8}"), { shouldValidate: true });
  }

  return (
    <Form {...form}>
      <ErrorDialog message={message} setMessage={setMessage} />
      <TestingOption
        feature="Fill form with testing data"
        onClick={fillWithTestingData}
        className="mb-4"
      />
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
        <SubmitButton form={form} label="Save" />
        {/* <TestDoctorForm form={form} formRef={formRef} /> */}
      </form>
    </Form>
  );
}
