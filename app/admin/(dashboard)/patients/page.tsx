import PatientsForm from "@/components/patients/PatientsForm";
import DefaultCard from "@/components/shared/DefaultCard";

export default function PatientsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <DefaultCard title="New Patient" description="Create a new patient">
        <PatientsForm />
      </DefaultCard>
    </div>
  );
}
