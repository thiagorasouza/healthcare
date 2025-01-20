"use server";

import { BookingView } from "@/components/book/BookingView";
import { listDoctors } from "@/server/actions/listDoctors.bypass";

export default async function BookPage() {
  const doctorsResult = await listDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";
  // throw new Error();

  return <BookingView doctors={doctors} />;
}
