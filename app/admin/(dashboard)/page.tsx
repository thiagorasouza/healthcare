"use server";

import DashboardView from "@/components/dashboard/DashboardView";
import { countDoctors } from "@/server/actions/countDoctors.bypass";

export default async function DashboardPage() {
  const doctorsCountResult = await countDoctors();
  console.log("🚀 ~ doctorsCountResult:", doctorsCountResult);
  const doctorsCount = doctorsCountResult.ok ? String(doctorsCountResult.value) : "error";

  return <DashboardView doctorsCount={doctorsCount} />;
}
