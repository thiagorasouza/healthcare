"use client";

import AppointmentCreator from "@/components/appointments/AppointmentCreator";
import { initialState, reducer, State } from "@/components/appointments/AppointmentCreatorReducer";
import { ErrorScreen } from "@/components/shared/ErrorScreen";
import { cn } from "@/lib/utils";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { BadgeCheck, CalendarDays, Clock, Pointer, UserRound } from "lucide-react";
import Image from "next/image";
import { ReactNode, useReducer } from "react";

interface MenuItem {
  icon: ReactNode;
  text: string;
  phase: State["phase"];
}

export function BookingView({ doctors }: { doctors: DoctorModel[] | "error" }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const menu: MenuItem[] = [
    {
      icon: <Pointer />,
      text: "Doctor",
      phase: "doctor_selection",
    },
    {
      icon: <CalendarDays />,
      text: "Date",
      phase: "date_selection",
    },
    {
      icon: <Clock />,
      text: "Hour",
      phase: "hour_selection",
    },
    {
      icon: <UserRound />,
      text: "Patient",
      phase: "patient_creation",
    },
    {
      icon: <BadgeCheck />,
      text: "Summary",
      phase: "summary",
    },
  ];

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
              {menu.map((item, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-4 p-3 text-dark-gray transition duration-700 [&>svg]:h-5 [&>svg]:w-5",
                    {
                      "text-dark-purple": item.phase === state.phase,
                    },
                  )}
                >
                  {item.icon}
                  <p>{item.text}</p>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="w-full max-w-7xl rounded-3xl bg-white p-6 px-8 pb-8">
          {doctors === "error" ? (
            <ErrorScreen
              title="Server Error"
              message="It looks like the server couldn't fetch the information required to load this page.
          Please try again."
            />
          ) : doctors.length === 0 ? (
            <ErrorScreen
              title="Error"
              message="Sorry, there are no doctors available."
              refresh={false}
            />
          ) : (
            <AppointmentCreator doctors={doctors} state={state} dispatch={dispatch} />
          )}
        </main>
      </div>
    </div>
  );
}
