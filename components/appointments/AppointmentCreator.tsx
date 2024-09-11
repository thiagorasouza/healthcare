"use client";

import PatientsForm from "@/components/patients/PatientsForm";
import BackButton from "@/components/shared/BackButton";
import DefaultCard from "@/components/shared/DefaultCard";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAppointment } from "@/lib/actions/createAppointment";
import { createPatient } from "@/lib/actions/createPatient";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getPatternsByDoctorId } from "@/lib/actions/getPatternsByDoctorId";
import { getSlots, Slots } from "@/lib/processing/getSlots";
import { type Doctor } from "@/lib/schemas/doctorsSchema";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import { weekdays } from "@/lib/schemas/patternsSchema";
import { capitalize, cn, colorize, getFirstName, getInitials, scrollToTop } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowRight, CalendarDays, Clock } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const MAX_DATES = 5;

interface AppointmentCreatorProps {
  doctors: Doctor[];
}

export default function AppointmentCreator({ doctors }: AppointmentCreatorProps) {
  const [step, setStep] = useState<number>(1);
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

    setDoctor(doctor);
    setSlots(slots);
  }

  function onDateClick(dateStr: string) {
    setPickedDate(dateStr);
  }

  function onHourClick(hour: string) {
    setPickedHour(hour);
  }

  function onNextClick() {
    setStep(2);
    scrollToTop();
  }

  function onBackClick() {
    setStep(1);
    scrollToTop();
  }

  function onPatientCreated(patient: PatientParsedData) {
    const doctorId = doctor!.$id;
    const patientId = patient.$id;
    const [hours, minutes] = pickedHour!.split(":").map((x) => Number(x));
    const startTime = new Date(pickedDate!);
    startTime.setHours(hours, minutes, 0, 0);

    createAppointment;
  }

  const dates = slots && [...slots.keys()].slice(0, MAX_DATES);
  const hours = slots && pickedDate && slots.get(pickedDate);

  return (
    <div className="mx-auto w-[1200px] w-full px-6">
      {step === 1 ? (
        <div className="space-y-20 py-10">
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
                      <NextButton onNextClick={onNextClick} />
                    </Section>
                  )}
                </Column>
              </div>
            </DrawerAnimation>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <DefaultCard
            title="Your details"
            description="Please fill in your details to proceed"
            className="col-span-8"
          >
            <PatientsForm action={createPatient} onSuccess={onPatientCreated} />
          </DefaultCard>
          <DefaultCard
            title="Appointment"
            description="Your appointment so far"
            className="col-span-4 self-start"
          >
            <div className="mb-8 flex items-center gap-3">
              <Avatar>
                <AvatarImage src={getImageLink(doctor!.pictureId)} />
                <AvatarFallback>{getInitials(doctor!.name)}</AvatarFallback>
              </Avatar>
              <div className="font-semibold">
                <p className="text-lg">{`Dr. ${doctor!.name}`}</p>
                <p className="text-sm text-gray">{doctor!.specialty}</p>
              </div>
              <div>
                <p></p>
              </div>
            </div>
            <div className="mb-8 space-y-2 text-sm">
              <p className="flex items-center gap-3">
                <CalendarDays className="h-4 w-4" />
                {format(new Date(pickedDate!), "PPP")}
              </p>
              <p className="flex items-center gap-3">
                <Clock className="h-4 w-4" />
                {pickedHour}
              </p>
            </div>
            <BackButton label="Change" onBackClick={onBackClick} />
          </DefaultCard>
        </div>
      )}
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

interface DoctorCardProps {
  index: number;
  doctor: Doctor;
  onDoctorClick: (doctor: Doctor) => void;
}

function DoctorCard({ index, doctor, onDoctorClick }: DoctorCardProps) {
  const picture = getImageLink(doctor.pictureId);
  const bgColor = colorize(index);

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

function NextButton({ onNextClick }: { onNextClick: () => void }) {
  return (
    <div
      className="flex h-[50px] w-[140px] cursor-pointer items-center gap-[16px] rounded-full bg-dark-purple p-[5px] transition hover:bg-darker-purple"
      onClick={onNextClick}
    >
      <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white">
        <ArrowRight className="h-[19px] w-[19px] text-dark-purple" />
      </div>
      <div className="text-[18px] font-medium text-white">Next</div>
    </div>
  );
}
