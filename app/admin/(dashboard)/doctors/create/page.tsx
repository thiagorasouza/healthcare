import DoctorsForm from "@/components/doctors/DoctorsForm";
import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import DefaultCard from "@/components/shared/DefaultCard";

export default function DoctorCreatePage() {
  return (
    <div className="mx-auto w-full max-w-[600px] space-y-6">
      <AdminBreadcrumbWithBackLink backLink="/admin/doctors" />
      <DefaultCard
        title="Create Doctor"
        description="Create a new doctor and a user account associated with it"
      >
        <DoctorsForm mode="create" />
      </DefaultCard>
    </div>
  );
}
