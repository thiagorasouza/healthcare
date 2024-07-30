import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import DoctorsForm from "@/components/forms/DoctorsForm";
import { Button } from "@/components/ui/button";
import { createDoctor } from "@/lib/actions/createDoctor";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DoctorCreatePage() {
  return (
    <div className="mx-auto w-full max-w-[600px]">
      <div className="mb-3 flex items-center justify-between">
        <AdminBreadcrumb />
        <Button variant="outline">
          <Link href="/admin/doctors" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>
      <DoctorsForm
        title="New Doctor"
        description="Create a new doctor and a user account associated with it"
        action={createDoctor}
      />
    </div>
  );
}
