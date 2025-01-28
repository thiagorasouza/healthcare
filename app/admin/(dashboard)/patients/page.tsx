"use client";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { PatientsCard } from "@/components/patients/PatientsCard";

export default function PatientsPage() {
  return (
    <div className="space-y-4">
      <AdminBreadcrumb />
      <PatientsCard />
    </div>
  );
}
