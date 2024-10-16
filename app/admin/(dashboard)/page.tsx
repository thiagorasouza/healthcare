"use server";

import DashboardView from "@/components/dashboard/DashboardView";
import { countDoctors } from "@/server/actions/countDoctors";

export default async function DashboardPage() {
  const doctorsCountResult = await countDoctors();
  const doctorsCount = doctorsCountResult.ok ? String(doctorsCountResult.value) : "error";

  return <DashboardView doctorsCount={doctorsCount} />;
}
