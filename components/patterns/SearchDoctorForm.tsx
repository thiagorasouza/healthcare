import { SearchAndSelectField } from "@/components/forms/SearchAndSelectField";
import { Form } from "@/components/ui/form";
import { listDoctors } from "@/server/actions/listDoctors.bypass";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const searchDoctorSchema = z.object({
  doctorId: z.string(),
});

type SearchDoctorForm = z.infer<typeof searchDoctorSchema>;

interface SearchDoctorFormProps {
  doctors: DoctorModel[];
  onSelect: (doctor: DoctorModel) => void;
  className?: string;
  selectFirst?: boolean;
}

export function SearchDoctorForm({
  doctors,
  onSelect,
  className,
  selectFirst = false,
}: SearchDoctorFormProps) {
  const form = useForm<SearchDoctorForm>({
    resolver: zodResolver(searchDoctorSchema),
    defaultValues: {
      doctorId: selectFirst ? doctors[0].id : undefined,
    },
  });

  function onSubmit(data: SearchDoctorForm) {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SearchAndSelectField
          form={form}
          label="Doctor"
          name="doctorId"
          parameter="name"
          defaultValue={selectFirst ? doctors[0] : undefined}
          entities={doctors}
          makeText={(doctor) => `${doctor.name} | ${doctor.specialty}`}
          makeLink={(doctor) => `/admin/doctors/${doctor.id}`}
          onSelect={onSelect}
          className={className}
        />
      </form>
    </Form>
  );
}
