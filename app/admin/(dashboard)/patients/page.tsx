"use client";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { PatientsCard } from "@/components/patients/PatientsCard";

export default function PatientsPage() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb />
      <PatientsCard />
    </div>
  );
}
