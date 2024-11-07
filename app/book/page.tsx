"use server";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { getDoctors } from "@/server/actions/getDoctors.bypass";
import { CalendarDays, Clock, Pointer } from "lucide-react";
import Image from "next/image";

export default async function BookPage() {
  const doctorsResult = await getDoctors();
  const doctors = doctorsResult.ok ? doctorsResult.value : "error";

  return (
    <div className="min-h-screen w-full bg-[#212121]">
      <div className="mx-auto flex max-w-[1580px] p-3">
        <aside className="flex max-w-[240px] flex-1 flex-col py-4">
          <header className="mb-8 ml-7 flex items-center gap-2">
            <Image
              src="/img/logo-dark.svg"
              alt="heartbeat logo"
              width={42}
              height={42}
              className="hidden md:block"
            />
            <h2 className="text-2xl font-medium text-white">Mednow</h2>
          </header>
          <nav>
            <ul className="ml-6 flex flex-col gap-2 text-base font-semibold text-white">
              <li className="flex cursor-pointer items-center gap-4 p-3 text-dark-purple">
                <Pointer className="h-5 w-5" />
                <div>Doctor</div>
              </li>
              <li className="flex cursor-pointer items-center gap-4 p-3 text-gray">
                <CalendarDays className="h-5 w-5" />
                <div>Date</div>
              </li>
              <li className="flex cursor-pointer items-center gap-4 p-3 text-gray">
                <Clock className="h-5 w-5" />
                <div>Hours</div>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="max-w-7xl rounded-3xl bg-white px-14 py-5">
          <AppointmentCreator doctors={doctors} />
        </main>
      </div>
    </div>
  );
}
