"use client";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { initialState, reducer } from "@/components/appointments/AppointmentCreatorReducer";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { CalendarDays, Clock, Pointer } from "lucide-react";
import Image from "next/image";
import { useReducer } from "react";

export function BookingView({ doctors }: { doctors: DoctorModel[] | "error" }) {
  const [state, dispatch] = useReducer(reducer, initialState);

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
              <li className="flex cursor-pointer items-center gap-4 p-3 text-dark-gray">
                <CalendarDays className="h-5 w-5" />
                <div>Date</div>
              </li>
              <li className="flex cursor-pointer items-center gap-4 p-3 text-dark-gray">
                <Clock className="h-5 w-5" />
                <div>Hours</div>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-full max-w-7xl rounded-3xl bg-white px-6 py-14">
          <AppointmentCreator doctors={doctors} state={state} dispatch={dispatch} />
        </main>
      </div>
    </div>
  );
}
