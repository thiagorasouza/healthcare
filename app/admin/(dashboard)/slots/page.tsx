import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";
import SlotsCard from "@/components/slots/SlotsCard";

export default function SlotsPage() {
  return (
    <div className="mx-auto w-full max-w-[800px] space-y-4">
      <AdminBreadcrumbWithBackLink backLink="/admin" />
      <SlotsCard />
    </div>
  );
}
