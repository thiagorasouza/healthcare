import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const doctors = [
  {
    name: "Dr. Claire",
    specialty: "Cardiologist",
    bgColor: "bg-light-purple", // light purple
    picture: "/doctors/fdoctor1.png",
  },
  {
    name: "Dr. Carmen",
    specialty: "Surgeon",
    bgColor: "bg-light-yellow", // light yellow
    picture: "/doctors/mdoctor1.png",
  },
  {
    name: "Dr. Richard",
    specialty: "Dermatologist",
    bgColor: "bg-light-green", // light green
    picture: "/doctors/mdoctor2.png",
  },
  {
    name: "Dr. Sydney",
    specialty: "General",
    bgColor: "bg-light-blue", // light blue
    picture: "/doctors/fdoctor2.png",
  },
];

export default function CreateAppointmentPage() {
  return (
    <div className="container mx-auto w-fit max-w-[1200px] space-y-20 px-6 py-10">
      <section className="text-center">
        <h1 className="mb-2 text-2xl font-bold">
          Let&apos;s find your <span className="text-yellow">top doctor</span>
        </h1>
        <p className="text-gray font-medium">Choose a doctor to see his or her available hours</p>
      </section>
      <section>
        <ul className="flex justify-between gap-6">
          {doctors.map((doctor, index) => (
            <li key={index}>
              <Doctor doctor={doctor} />
            </li>
          ))}
        </ul>
      </section>
      <div className="flex gap-[72px]">
        <Column>
          <Section title="Information">
            <p className="text-gray text-base leading-relaxed">
              Dr. Claire, a seasoned cardiologist in Lisbon, brings years of expertise in hospital
              settings. She holds a medical degree from the University of Lisbon and a cardiology
              specialization from the University of Porto. Dr. Claire is dedicated to heart health
              and patient care.
            </p>
          </Section>
          <Section title="Pick a date">
            <ul className="flex gap-[18px]">
              <li>
                <Date day="7" weekday="Mon" />
              </li>
              <li>
                <Date day="8" weekday="Tue" />
              </li>
              <li>
                <Date day="9" weekday="Wed" highlight={true} />
              </li>
              <li>
                <Date day="10" weekday="Thu" />
              </li>
              <li>
                <Date day="11" weekday="Fri" />
              </li>
            </ul>
          </Section>
        </Column>
        <Column>
          <Section title="Available hours">
            <ul className="flex flex-wrap gap-[16px]">
              <li>
                <Hour hour="08:00" />
              </li>
              <li>
                <Hour hour="08:30" />
              </li>
              <li>
                <Hour hour="09:00" highlight={true} />
              </li>
              <li>
                <Hour hour="09:30" />
              </li>
              <li>
                <Hour hour="10:00" />
              </li>
              <li>
                <Hour hour="10:30" />
              </li>
              <li>
                <Hour hour="11:00" />
              </li>
              <li>
                <Hour hour="11:30" />
              </li>
              <li>
                <Hour hour="12:00" />
              </li>
            </ul>
          </Section>
          <Section title="Summary">
            <p className="text-gray leading-relaxed">
              Cardiology Appointment with Dr. Claire
              <br />
              Wed 8th July 2024
              <br />
              16:00
            </p>
          </Section>
        </Column>
      </div>
    </div>
  );
}

function Column({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 space-y-[30px]">{children}</div>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-[30px] text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Doctor({
  doctor,
}: {
  doctor: {
    name: string;
    specialty: string;
    picture: string;
    bgColor: string;
  };
}) {
  return (
    <div className={cn("relative h-[234px] w-[236px] rounded-[60px]", doctor.bgColor)}>
      <Image
        src={doctor.picture}
        alt="female doctor"
        width={472}
        height={524}
        className="absolute -top-[28px] left-0 right-0"
      />
      <div className="absolute -bottom-[26px] left-[13px] right-[13px] flex h-[70px] items-center gap-3 rounded-[20px] bg-white px-[22px] py-[17px] shadow">
        <div className="font-semibold">
          <h3 className="text-md">{doctor.name}</h3>
          <p className="text-gray text-xs">{doctor.specialty}</p>
        </div>
        <Image
          src="/icons/arrow-icon.svg"
          alt="Right arrow with circle icon"
          width={31}
          height={31}
          className="ml-auto"
        />
      </div>
    </div>
  );
}

function Date({
  day,
  weekday,
  highlight = false,
}: {
  day: string;
  weekday: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-light-gray flex w-[72px] flex-col items-center justify-center rounded-[28px] border-2 py-[16px] font-semibold",
        highlight && "bg-yellow cursor-pointer border-none text-white",
      )}
    >
      <p className="text-[22px]">{day}</p>
      <p className={cn("text-[14px]", !highlight && "text-gray")}>{weekday}</p>
    </div>
  );
}

function Hour({ hour, highlight }: { hour: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        "border-light-gray flex w-[72px] items-center justify-center rounded-[15px] border-2 py-[9px] font-semibold",
        highlight && "bg-yellow border-none text-white",
      )}
    >
      {hour}
    </div>
  );
}
