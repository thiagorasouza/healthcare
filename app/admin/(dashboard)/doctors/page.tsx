"use client";

import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";
import { DoctorsCard } from "@/components/doctors/DoctorsCard";

export default function DoctorsPage() {
  return (
    <div className="space-y-4">
      <AdminBreadcrumb />
      <DoctorsCard />
    </div>
  );
}
