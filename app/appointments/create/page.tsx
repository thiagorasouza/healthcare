"use server";

import { BookingView } from "@/components/book/BookingView";
import { getDoctors } from "@/server/actions/getDoctors.bypass";

export default async function BookPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";
  // throw new Error();

  return <BookingView doctors={doctors} />;
}
