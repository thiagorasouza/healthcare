"use client";

import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Form } from "@/components/ui/form";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getPatternsByDoctorId } from "@/lib/actions/getPatternsByDoctorId";
import { getSlots, Slots } from "@/lib/processing/getSlots";
import { type Doctor } from "@/lib/schemas/doctorsSchema";
import { weekdays } from "@/lib/schemas/patternsSchema";
import { capitalize, cn, colorize, getFirstName } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const MAX_DATES = 5;

interface AppointmentCreatorProps {
  doctors: Doctor[];
}

export default function AppointmentCreator({ doctors }: AppointmentCreatorProps) {
  const [doctor, setDoctor] = useState<Doctor | undefined>();
  const [slots, setSlots] = useState<Slots | undefined>();
  const [pickedDate, setPickedDate] = useState<string | undefined>();
  const [pickedHour, setPickedHour] = useState<string | undefined>();

  async function onDoctorClick(doctor: Doctor) {
    setPickedDate(undefined);
    setPickedHour(undefined);

    const result = await getPatternsByDoctorId(doctor.$id);
    if (!result.success || !result.data) {
      setDoctor(doctor);
      return;
    }

    const patterns = result.data;
    const slots = getSlots(patterns);
    console.log("🚀 ~ slots:", slots);

    setDoctor(doctor);
    setSlots(slots);
  }

  function onDateClick(dateStr: string) {
    setPickedDate(dateStr);
  }

  function onHourClick(hour: string) {
    setPickedHour(hour);
  }

  const dates = slots && [...slots.keys()].slice(0, MAX_DATES);
  const hours = slots && pickedDate && slots.get(pickedDate);

  const appointmentSchema = z.object({
    doctorId: z.string(),
    patientId: z.string(),
    startTime: z.coerce.date(),
  });

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      doctorId: "",
      patientId: "",
      startTime: undefined,
    },
  });

  function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.log)}>
        <div className="container mx-auto w-fit max-w-[1200px] space-y-20 px-6 py-10">
          <section className="text-center">
            <h1 className="mb-2 text-2xl font-bold">
              Let&apos;s find your <span className="text-yellow">top doctor</span>
            </h1>
            <p className="font-medium text-gray">
              Choose a doctor to see his or her available hours
            </p>
          </section>
          <section>
            <ul className="flex justify-between gap-6">
              {doctors.map((doctor, index) => (
                <li key={index}>
                  <DoctorCard index={index} doctor={doctor} onDoctorClick={onDoctorClick} />
                </li>
              ))}
            </ul>
          </section>
          {doctor && (
            <DrawerAnimation toggle={!!doctor}>
              <div className="flex gap-[72px]">
                <Column>
                  <Section title="Information">
                    <p className="text-base leading-relaxed text-gray">{doctor.bio}</p>
                  </Section>
                  <Section title="Pick a date">
                    {dates ? (
                      <ul className="flex gap-[18px]">
                        {dates.map((dateStr, index) => (
                          <li key={index}>
                            <DateCard
                              dateStr={dateStr}
                              highlight={dateStr === pickedDate}
                              onDateClick={onDateClick}
                            />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>No dates available for this doctor</p>
                    )}
                  </Section>
                </Column>
                <Column>
                  {hours && (
                    <Section title="Available hours">
                      <ul className="flex flex-wrap gap-[16px]">
                        {hours.map(([hour], index) => (
                          <li key={index}>
                            <HourCard
                              hour={hour}
                              onHourClick={onHourClick}
                              highlight={hour === pickedHour}
                            />
                          </li>
                        ))}
                      </ul>
                    </Section>
                  )}
                  {pickedDate && pickedHour && (
                    <Section title="Summary">
                      <p className="mb-7 leading-relaxed text-gray">
                        {doctor.specialty} appointment with Dr. {getFirstName(doctor.name)}
                        <br />
                        {format(pickedDate, "PPP")} at {pickedHour}
                        <br />
                      </p>
                      <div className="flex h-[50px] w-[140px] cursor-pointer items-center gap-[16px] rounded-full bg-dark-purple p-[5px] transition hover:bg-darker-purple">
                        <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
                          <ArrowRight className="h-[19px] w-[19px] text-dark-purple" />
                        </div>
                        <div className="text-[18px] font-medium text-white">Next</div>
                      </div>
                    </Section>
                  )}
                </Column>
              </div>
            </DrawerAnimation>
          )}
        </div>
      </form>
    </Form>
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

interface DoctorCardProps {
  index: number;
  doctor: Doctor;
  onDoctorClick: (doctor: Doctor) => void;
}

function DoctorCard({ index, doctor, onDoctorClick }: DoctorCardProps) {
  const picture = getImageLink(doctor.pictureId);
  const bgColor = colorize(index);
  console.log("🚀 ~ bgColor:", bgColor);

  return (
    <div
      className={cn(
        "relative h-[234px] w-[236px] cursor-pointer rounded-[60px] transition hover:scale-105",
        bgColor,
      )}
      onClick={() => onDoctorClick(doctor)}
    >
      <Image
        src={picture}
        alt="female doctor"
        width={472}
        height={524}
        className="absolute -top-[28px] left-0 right-0"
      />
      <div className="absolute -bottom-[26px] left-[13px] right-[13px] flex h-[70px] items-center gap-3 rounded-[20px] bg-white px-[22px] py-[17px] shadow">
        <div className="font-semibold">
          <h3 className="text-md">Dr. {getFirstName(doctor.name)}</h3>
          <p className="text-xs text-gray">{doctor.specialty}</p>
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

interface DateCardProps {
  dateStr: string;
  highlight?: boolean;
  onDateClick: (dateStr: string) => void;
}

function DateCard({ dateStr, onDateClick, highlight = false }: DateCardProps) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const weekday = capitalize(weekdays[date.getDay()]);
  return (
    <div
      className={cn(
        "flex w-[72px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-light-gray py-[16px] font-semibold transition hover:scale-110",
        highlight && "border-none bg-yellow text-white",
      )}
      onClick={() => onDateClick(dateStr)}
    >
      <p className="text-[22px]">{day}</p>
      <p className={cn("text-[14px]", !highlight && "text-gray")}>{weekday}</p>
    </div>
  );
}

interface HourCardProps {
  hour: string;
  highlight?: boolean;
  onHourClick: (hour: string) => void;
}

function HourCard({ hour, highlight, onHourClick }: HourCardProps) {
  return (
    <div
      className={cn(
        "flex w-[72px] cursor-pointer items-center justify-center rounded-[15px] border-2 border-light-gray py-[9px] font-semibold transition duration-200 hover:scale-110",
        highlight && "border-none bg-yellow text-white",
      )}
      onClick={() => onHourClick(hour)}
    >
      {hour}
    </div>
  );
}
