"use server";

import { Calendar, CalendarDays } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const OnboardingPage = () => {
  return (
    <div className="flex min-h-screen w-full justify-center">
      <div className="relative flex w-full max-w-[1440px] flex-col px-8 py-4 text-black md:px-16 md:py-8">
        <nav className="mb-8 flex items-center justify-between">
          <button className="md:hidden">
            <Image src="/img/menu.svg" width={36} height={36} alt="menu icon" />
          </button>
          <header className="flex items-center gap-3">
            <Image
              src="/img/logo.png"
              alt="heartbeat logo"
              width={42}
              height={42}
              className="hidden md:block"
            />
            <h2 className="text-2xl font-bold">Mednow</h2>
          </header>
          <ul className="hidden font-medium md:flex md:gap-8">
            <li>
              <Link className="text-black" href="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="text-black" href="/book">
                Book
              </Link>
            </li>
            <li>
              <Link className="text-black" href="/admin">
                Dashboard
              </Link>
            </li>
          </ul>
          <button className="flex h-[52px] items-center gap-[9px] rounded-full bg-white p-[5px] focus:outline-none">
            <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full bg-yellow">
              <CalendarDays className="h-4 w-4 text-white" />
            </div>
            <span className="mr-[27px] hidden font-semibold text-yellow md:block">
              <Link href="/appointment">Appointment Details</Link>
            </span>
          </button>
        </nav>
        <main className="flex flex-1 flex-col gap-8 pt-[15vh] text-center md:items-start md:justify-center md:gap-10 md:pl-28 md:pt-0 md:text-left">
          <h1 className="text-[52px] font-semibold leading-[1.2] md:text-6xl">
            Medical &<br /> Health Care
            <br /> Services
          </h1>
          <p className="font-medium text-gray">
            Online consultations with certified medical
            <br /> professionals
          </p>
          <Link href="/book" className="mx-auto mt-10 md:m-0">
            <button className="flex h-[60px] items-center gap-[9px] rounded-full bg-darker-purple p-[5px] focus:outline-none">
              <div className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-white">
                <Image
                  src="/img/arrow.svg"
                  alt="user icon"
                  width={18}
                  height={18}
                  className="mt-[1px] text-white"
                />
              </div>
              <span className="mr-[27px] text-[17px] font-medium text-white">
                Book An Appointment
              </span>
            </button>
          </Link>
        </main>
      </div>
      <Image
        src="/img/side.png"
        alt="Doctor"
        width={1418}
        height={2048}
        className="absolute right-0 top-0 -z-10 hidden h-full max-h-[100vh] w-fit md:block"
      />
    </div>
  );
};

export default OnboardingPage;
