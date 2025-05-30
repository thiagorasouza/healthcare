import DoctorForm from "@/components/doctors/DoctorForm";
import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import DefaultCard from "@/components/shared/DefaultCard";

export default function DoctorCreatePage() {
  return (
    <div className="mx-auto w-full max-w-[600px] space-y-4">
      <AdminBreadcrumbWithBackLink backLink="/admin/doctors" />
      <DefaultCard title="Create Doctor" description="Fill the form to create a new doctor">
        <DoctorForm mode="create" />
      </DefaultCard>
    </div>
  );
}
