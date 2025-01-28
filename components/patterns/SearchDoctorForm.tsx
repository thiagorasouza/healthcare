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

export function SearchDoctorForm({
  onSelect,
  className,
}: {
  onSelect: (doctor: DoctorModel) => void;
  className?: string;
}) {
  const [doctors, setDoctors] = useState<DoctorModel[] | "error">();

  async function loadDoctors() {
    try {
      const doctorsResult = await listDoctors();
      if (!doctorsResult.ok) {
        throw doctorsResult.error;
      }
      setDoctors(doctorsResult.value);
      // For demo purposes
    } catch (error) {
      console.log(error);
      setDoctors("error");
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  const error = doctors === "error";
  const loading = !doctors;

  const form = useForm<SearchDoctorForm>({
    resolver: zodResolver(searchDoctorSchema),
    defaultValues: {
      doctorId: "677d41f0001a454b1602",
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
          entities={!error && !loading ? doctors : undefined}
          makeText={(doctor) => `${doctor.name} | ${doctor.specialty}`}
          makeLink={(doctor) => `/admin/doctors/${doctor.id}`}
          onSelect={onSelect}
          className={className}
        />
      </form>
    </Form>
  );
}
