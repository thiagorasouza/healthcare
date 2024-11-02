"use client";

import { DoctorsCarousel } from "@/components/appointments/DoctorsCarousel";
import AlertMessage from "@/components/forms/AlertMessage";
import PatientsForm from "@/components/patients/PatientsForm";
import BackButton from "@/components/shared/BackButton";
import DefaultCard from "@/components/shared/DefaultCard";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { createPatient } from "@/lib/actions/createPatient";
import { getFileMetadataServer } from "@/lib/actions/getFileMetadataServer";
import { getImageLink } from "@/lib/actions/getImageLink";
import { getPatternsByDoctorId } from "@/lib/actions/getPatternsByDoctorId";
import { updatePatient } from "@/lib/actions/updatePatient";
import { env } from "@/lib/env";
import { getSlots, Slots } from "@/lib/processing/getSlots";
import { unexpectedError } from "@/lib/results";
import { IdentificationData } from "@/lib/schemas/appointmentsSchema";
import { PatientParsedData } from "@/lib/schemas/patientsSchema";
import { weekdays } from "@/lib/schemas/patternsSchema";
import {
  capitalize,
  cn,
  getFirstName,
  getInitials,
  objectToFormData,
  scrollToTop,
  subtractTimeStrings,
} from "@/lib/utils";
import { createAppointment } from "@/server/actions/createAppointment";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { format, set } from "date-fns";
import {
  ArrowRight,
  CalendarDays,
  CircleUserRound,
  Clock,
  Hourglass,
  SquarePen,
} from "lucide-react";
import { useState } from "react";

const MAX_DATES = 5;

interface AppointmentCreatorProps {
  doctors: DoctorModel[] | "error";
}

export default function AppointmentCreator({ doctors }: AppointmentCreatorProps) {
  const [step, setStep] = useState<number>(1);
  const [doctor, setDoctor] = useState<DoctorModel | undefined>();
  const [slots, setSlots] = useState<Slots | undefined>();
  const [pickedDate, setPickedDate] = useState<string | undefined>();
  const [pickedHour, setPickedHour] = useState<{ hour: string; duration: number } | undefined>();
  const [showPatientForm, setShowPatientForm] = useState<boolean>(true);
  const [patientData, setPatientData] = useState<PatientParsedData | undefined>();
  const [identification, setIdentification] = useState<IdentificationData | undefined>();
  const [message, setMessage] = useState("");

  async function onDoctorClick(doctor: DoctorModel) {
    if (!doctor) return;

    setPickedDate(undefined);
    setPickedHour(undefined);

    const result = await getPatternsByDoctorId(doctor.id);
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

  function onHourClick(hour: string, duration: number) {
    setPickedHour({ hour, duration });
  }

  function onNextClick() {
    setStep(2);
    scrollToTop();
  }

  function onBackClick() {
    setStep(1);
    scrollToTop();
  }

  async function onPatientCreated(patient: PatientParsedData) {
    setShowPatientForm(false);
    setPatientData(patient);

    const identificationResult = await getFileMetadataServer(
      env.docsBucketId,
      patient.identificationId,
    );

    setIdentification(identificationResult?.data);
  }

  function onPatientEditClick() {
    setShowPatientForm(true);
  }

  async function onBookClick() {
    if (!doctor) return;

    setMessage("");
    try {
      const doctorId = doctor.id;
      const patientId = patientData!.$id;

      const [hours, minutes] = pickedHour!.hour.split(":").map((x) => Number(x));
      const startTime = set(new Date(pickedDate!), { hours, minutes, seconds: 0, milliseconds: 0 });

      const duration = pickedHour!.duration;

      const result = await createAppointment(
        objectToFormData({ doctorId, patientId, startTime, duration }),
      );
      if (!result.ok) {
        setMessage(result.error.code);
        return;
      }

      setStep(3);
    } catch (error) {
      console.log(error);

      setMessage(unexpectedError().message);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  const dates = slots && [...slots.keys()].slice(0, MAX_DATES);
  const hours = slots && pickedDate && slots.get(pickedDate);

  if (doctors === "error") {
    return;
  }

  return (
    <div>
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
          <DoctorsCarousel doctors={doctors} onDoctorClick={onDoctorClick} />

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
                        {hours.map(([hour, end], index) => {
                          const duration = subtractTimeStrings(hour, end);
                          return (
                            <li key={index}>
                              <HourCard
                                hour={hour}
                                duration={duration}
                                onHourClick={onHourClick}
                                highlight={hour === pickedHour?.hour}
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </Section>
                  )}
                  {pickedDate && pickedHour && (
                    <Section title="Summary">
                      <p className="mb-7 leading-relaxed text-gray">
                        {doctor.specialty} appointment with Dr. {getFirstName(doctor.name)}
                        <br />
                        {format(pickedDate, "PPP")} at {pickedHour!.hour}
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
      ) : step === 2 ? (
        <div>
          <AlertMessage message={message} />
          <div className="grid grid-cols-12 items-start gap-6">
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
                  {pickedHour?.hour}
                </p>
                <p className="flex items-center gap-3">
                  <Hourglass className="h-4 w-4" />
                  {pickedHour?.duration} minutes
                </p>
              </div>
              <BackButton label="Change" onBackClick={onBackClick} />
            </DefaultCard>
            <DefaultCard
              title="Patient details"
              description={
                !patientData ? "Please fill in your details to proceed" : "Current saved patient"
              }
              className="col-span-8"
            >
              {showPatientForm ? (
                <PatientsForm
                  data={patientData}
                  identification={identification}
                  action={patientData ? updatePatient : createPatient}
                  onSuccess={onPatientCreated}
                  submitLabel="Save"
                />
              ) : patientData ? (
                <div className="flex items-center gap-3">
                  <div>
                    <CircleUserRound className="h-9 w-9" />
                  </div>
                  <div>
                    <p className="font-semibold">{patientData.name}</p>
                    <p className="text-sm">
                      {patientData.email} | {patientData.phone}
                    </p>
                  </div>
                </div>
              ) : (
                <p>Error retrieving saved patient. Please edit below</p>
              )}
              {!showPatientForm && (
                <div className="mt-7 flex">
                  <div>
                    <Button
                      className="flex items-center"
                      variant="outline"
                      onClick={onPatientEditClick}
                    >
                      <SquarePen className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                  <div className="ml-auto">
                    <Button className="flex items-center" onClick={onBookClick}>
                      Confirm & Book
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </DefaultCard>
          </div>
        </div>
      ) : (
        <div>Appointment Booked </div>
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
  duration: number;
  highlight?: boolean;
  onHourClick: (hour: string, duration: number) => void;
}

function HourCard({ hour, duration, highlight, onHourClick }: HourCardProps) {
  return (
    <div
      className={cn(
        "flex w-[72px] cursor-pointer items-center justify-center rounded-[15px] border-2 border-light-gray py-[9px] font-semibold transition duration-200 hover:scale-110",
        highlight && "border-none bg-yellow text-white",
      )}
      onClick={() => onHourClick(hour, duration)}
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
