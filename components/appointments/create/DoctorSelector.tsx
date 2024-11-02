import { DoctorsCarousel } from "@/components/appointments/DoctorsCarousel";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { getPatternsByDoctorId } from "@/lib/actions/getPatternsByDoctorId";
import { getSlots, Slots } from "@/lib/processing/getSlots";
import { capitalize, cn, getFirstName, subtractTimeStrings } from "@/lib/utils";
import { weekdays } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

const MAX_DATES = 5;

interface DoctorSelectorProps {
  doctors: DoctorModel[];
  doctor?: DoctorModel;
  slots?: Slots;
  date?: string;
  hour?: { hour: string; duration: number };
  onCompletion: (
    doctor: DoctorModel,
    slots: Slots,
    date: string,
    hour: string,
    duration: number,
  ) => unknown;
}

export function DoctorSelector({
  doctors,
  doctor,
  slots,
  date,
  hour,
  onCompletion,
}: DoctorSelectorProps) {
  const [pickedSlots, setPickedSlots] = useState<Slots | undefined>(slots);
  const [pickedDoctor, setPickedDoctor] = useState<DoctorModel | undefined>(doctor);
  const [pickedDate, setPickedDate] = useState<string | undefined>(date);
  const [pickedHour, setPickedHour] = useState<{ hour: string; duration: number } | undefined>(
    hour,
  );

  async function onDoctorClick(doctor: DoctorModel) {
    // console.log("🚀 ~ doctor:", doctor);
    if (!doctor) return;

    setPickedDate(undefined);
    setPickedHour(undefined);

    const result = await getPatternsByDoctorId(doctor.id);
    // console.log("🚀 ~ result:", result);
    if (!result.success || !result.data) {
      setPickedDoctor(doctor);
      return;
    }

    const patterns = result.data;
    const slots = getSlots(patterns);

    setPickedDoctor(doctor);
    setPickedSlots(slots);
  }

  function onDateClick(dateStr: string) {
    setPickedDate(dateStr);
  }

  function onHourClick(hour: string, duration: number) {
    setPickedHour({ hour, duration });
  }

  const dates = pickedSlots && [...pickedSlots.keys()].slice(0, MAX_DATES);
  console.log("🚀 ~ dates:", dates);
  const hours = pickedSlots && pickedDate && pickedSlots.get(pickedDate);
  console.log("🚀 ~ hours:", hours);

  return (
    <div className="space-y-20 py-10">
      <section className="text-center">
        <h1 className="mb-2 text-2xl font-bold">
          Let&apos;s find your <span className="text-yellow">top doctor</span>
        </h1>
        <p className="font-medium text-gray">Choose a doctor to see his or her available hours</p>
      </section>

      <DoctorsCarousel doctors={doctors} onDoctorClick={onDoctorClick} />

      {pickedDoctor && pickedSlots && (
        <DrawerAnimation toggle={!!pickedDoctor}>
          <div className="flex gap-[72px]">
            <Column>
              <Section title="Information">
                <p className="text-base leading-relaxed text-gray">{pickedDoctor.bio}</p>
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
                    {pickedDoctor.specialty} appointment with Dr. {getFirstName(pickedDoctor.name)}
                    <br />
                    {format(pickedDate, "PPP")} at {pickedHour!.hour}
                    <br />
                  </p>
                  <NextButton
                    onNextClick={() =>
                      onCompletion(
                        pickedDoctor,
                        pickedSlots,
                        pickedDate,
                        pickedHour.hour,
                        pickedHour.duration,
                      )
                    }
                  />
                </Section>
              )}
            </Column>
          </div>
        </DrawerAnimation>
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
