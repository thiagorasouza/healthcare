"use server";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { BookingView } from "@/components/book/BookingView";
import { getDoctors } from "@/server/actions/getDoctors.bypass";
import { CalendarDays, Clock, Pointer } from "lucide-react";
import Image from "next/image";

export default async function BookPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";

  return <BookingView doctors={doctors} />;
}
