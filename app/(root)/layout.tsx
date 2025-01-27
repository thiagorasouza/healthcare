"use client";

import { initialState, reducer, State } from "@/components/appointments/AppointmentCreatorReducer";
import { ReducerContext } from "@/lib/context/reducerContext";
import { cn } from "@/lib/utils";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  Clock,
  House,
  ListCheck,
  Pointer,
  Search,
  UserRound,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo, useReducer } from "react";

interface MenuItem {
  icon: ReactNode;
  text: string;
  phase: State["phase"];
}

export const mainMenu: MenuItem[] = [
  {
    icon: <House />,
    text: "Start",
    phase: "initial",
  },
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
    icon: <ListCheck />,
    text: "Summary",
    phase: "summary",
  },
  {
    icon: <BadgeCheck />,
    text: "Confirmation",
    phase: "confirmation",
  },
];

export default function AppointmentLayout({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const phaseIndex = useMemo(() => {
    for (let i = 0; i < mainMenu.length; i++) {
      if (mainMenu[i].phase === state.phase) {
        return i;
      }
    }
    return 0;
  }, [state.phase]);

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      <div className="min-h-screen w-full md:bg-[#212121]">
        <div className="mx-auto flex max-w-[1580px] flex-1 justify-center gap-10 p-3">
          <aside className="hidden flex-shrink-0 flex-col py-4 xl:flex">
            <header className="mb-8 px-4">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/img/logo-dark.svg"
                  alt="heartbeat logo"
                  width={42}
                  height={42}
                  className="hidden md:block"
                />
                <h2 className="text-2xl font-medium text-white">Mednow</h2>
              </Link>
            </header>
            <nav>
              <ul className="ml-3 flex flex-col gap-2 text-base font-semibold text-white">
                {mainMenu.map((item, index) => (
                  <li
                    key={index}
                    className={cn(
                      "flex items-center gap-4 px-5 py-3 text-dark-gray transition duration-700 [&>svg]:h-5 [&>svg]:w-5",
                      {
                        "text-dark-purple": index === phaseIndex,
                      },
                    )}
                  >
                    {/* {item.icon} */}
                    {index < phaseIndex ? <Check /> : item.icon}
                    <p>{item.text}</p>
                  </li>
                ))}
                <li className="mt-8 cursor-pointer rounded-full px-5 py-3 font-medium text-white transition duration-300 hover:rounded-full hover:bg-black hover:text-white">
                  <Link href="/find" className="flex items-center gap-4">
                    <Search className="h-5 w-5" />
                    <p>Find</p>
                  </Link>
                </li>
              </ul>
            </nav>
          </aside>
          <main className="relative w-full overflow-hidden rounded-3xl bg-white p-2 md:px-3 lg:px-6 xl:w-[80%]">
            {children}
          </main>
        </div>
      </div>
    </ReducerContext.Provider>
  );
}
