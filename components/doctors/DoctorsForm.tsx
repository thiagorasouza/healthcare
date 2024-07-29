"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { cn, objectToFormData } from "@/lib/utils";
import {
  allowedImageTypes,
  DoctorData,
  DoctorDataUpdate,
  doctorsSchema,
} from "@/lib/schemas/doctorsSchema";
import { Textarea } from "@/components/ui/textarea";
import { ImageUp } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Error, Result, unexpectedError } from "@/lib/results";
import Image from "next/image";
import { getImageClient } from "@/lib/actions/getImageClient";

export default function DoctorsForm({
  data: doctorData,
  action,
}: {
  data?: DoctorDataUpdate;
  action: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}) {
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
    getImageClient(doctorData.pictureId).then((result) => {
      if (result.success) {
        const imageUrl = result.data as URL;
        console.log("🚀 ~ imageUrl:", imageUrl);
        fetch(imageUrl)
          .then((response) => response.blob())
          .then((blob) =>
            form.setValue(
              "picture",
              new File([blob], "___current___.jpg", { type: "image/jpeg" }),
              {
                shouldValidate: true,
              },
            ),
          );
      }
    });
  }, [doctorData, form]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // console.log("🚀 ~ acceptedFiles:", acceptedFiles);
      form.setValue("picture", acceptedFiles[0], { shouldValidate: true });
    },
    [form],
  );

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: allowedImageTypes.reduce((obj: any, type: string) => {
        obj[type] = [];
        return obj;
      }, {}),
      multiple: false,
    });

  async function onSubmit(data: any) {
    console.log("Form submitted");
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
      console.log("🚀 ~ error:", error);
      setMessage(unexpectedError().message);
    }
  }

  function onErrors(...args: any[]) {
    console.log(args);
  }

  return (
    <>
      <Form {...form}>
        <Alert
          variant="destructive"
          className={cn("mb-4 text-sm leading-none", {
            hidden: message === "",
          })}
        >
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription>{message}</AlertDescription>
        </Alert>
        <form
          onSubmit={form.handleSubmit(onSubmit, onErrors)}
          className="flex flex-col gap-3 md:gap-6"
          ref={formRef}
        >
          <div className="flex items-center gap-3 md:gap-5">
            <FormField
              name="picture"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={cn(
                        "flex h-32 w-32 cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-md border-2 border-dashed border-border bg-background text-foreground",
                        form.formState.errors.picture &&
                          "border-red-400 text-red-400",
                        field.value && "border-none",
                      )}
                      {...getRootProps()}
                    >
                      <input {...getInputProps({})} />
                      {field.value ? (
                        <Image
                          src={URL.createObjectURL(field.value)}
                          alt="selected picture"
                          className="h-full w-full object-cover"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <>
                          <ImageUp className="h-6 w-6" />
                          <span className="text-center text-xs">
                            {isDragActive ? "Drop here" : "Upload"}
                          </span>
                        </>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      data-cy="name"
                      placeholder="John Doe"
                      readOnly={form.formState.isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Should not include title (Dr., Mr., Mrs., etc.)
                  </FormDescription>
                  <FormMessage data-cy="nameError" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="specialty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Specialty</FormLabel>
                <FormControl>
                  <Input
                    data-cy="specialty"
                    placeholder="Cardiology"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Must include country code
                </FormDescription>
                <FormMessage data-cy="specialtyError" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Biography</FormLabel>
                <FormControl>
                  <Textarea
                    data-cy="bio"
                    readOnly={form.formState.isSubmitting}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Characters count: <strong>{field.value.length}/150</strong>
                </FormDescription>
                <FormMessage data-cy="bioError" />
              </FormItem>
            )}
          />
          <fieldset className="rounded-lg border p-5 pt-3">
            <legend className="-ml-1 px-1 text-sm font-medium text-muted-foreground">
              User
            </legend>
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        data-cy="email"
                        placeholder="name@example.com"
                        readOnly={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      This will be used for the doctor to login
                    </FormDescription>
                    <FormMessage data-cy="emailError" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        data-cy="phone"
                        placeholder="+351 000 000 000"
                        readOnly={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Must include country code
                    </FormDescription>
                    <FormMessage data-cy="phoneError" />
                  </FormItem>
                )}
              />
            </div>
          </fieldset>

          <Button
            type="submit"
            data-cy="submit"
            className="mt-2 w-full md:mt-4"
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
