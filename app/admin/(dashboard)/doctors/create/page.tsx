import DoctorsForm from "@/components/doctors/DoctorsForm";

export default function DoctorCreatePage() {
  return (
    <div className="mx-auto w-full max-w-[600px]">
      <h1 className="mb-8 w-fit border-b border-border pb-2 text-3xl font-semibold tracking-tight">
        New Doctor
      </h1>
      <DoctorsForm />
    </div>
  );
}
