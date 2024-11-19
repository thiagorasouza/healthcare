import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { capitalize, cn, subtractTimeStrings } from "@/lib/utils";
import { MIN_ADVANCE, weekdays } from "@/server/config/constants";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { addMinutes, isBefore, isToday, parse } from "date-fns";
import { CalendarX } from "lucide-react";

const MAX_DATES = 5;

interface Props {
  doctor: DoctorModel;
  slots: SlotsModel;
  slot?: {
    date?: string;
    hour?: string;
    duration?: number;
  };
  onDateClick: (dateStr: string) => void;
  onHourClick: (hour: string, duration: number) => void;
}

export function SlotSelector({ slots, doctor, slot, onDateClick, onHourClick }: Props) {
  const dates = [...slots.keys()].slice(0, MAX_DATES);
  const dateSelected = slot?.date;

  let hours = (dateSelected && slots.get(dateSelected)) || [];

  if (dateSelected && isToday(dateSelected)) {
    const minAdvance = addMinutes(new Date(), MIN_ADVANCE);
    hours = hours.filter(([hourStr]) => {
      const hourDate = parse(hourStr, "HH:mm", new Date());
      return isBefore(minAdvance, hourDate);
    });
  }

  return (
    // <DrawerAnimation toggle={!!doctor}>
    <div className="flex flex-col gap-9 px-2 lg:grid lg:grid-cols-2 lg:gap-12">
      <Column className="col-span-1">
        <Information bio={doctor.bio} />
        <DatePicker
          dates={dates}
          date={slot?.date ? slot.date : undefined}
          onDateClick={onDateClick}
        />
      </Column>
      <Column className="col-span-1">
        {slot?.date && <HourPicker hours={hours} onHourClick={onHourClick} hour={slot.hour} />}
      </Column>
    </div>
    // </DrawerAnimation>
  );
}

interface DatePickerProps {
  dates: string[];
  date?: string;
  onDateClick: (dateStr: string) => void;
}

function DatePicker({ dates, date, onDateClick }: DatePickerProps) {
  return (
    <Section title="Pick a date">
      <>
        {dates.length > 0 ? (
          <ul className="-ml-3 -mt-2 flex gap-2 overflow-x-auto px-3 py-2 md:gap-4">
            {dates.map((dateStr, index) => (
              <li key={index}>
                <DateCard
                  dateStr={dateStr}
                  highlight={!!date && dateStr === date}
                  onDateClick={onDateClick}
                />
              </li>
            ))}
          </ul>
        ) : (
          <>
            <p className="flex items-center text-gray">
              <CalendarX className="align mr-2 inline h-5 w-5 text-yellow" />{" "}
              <span className="font-medium">No dates available for this doctor yet.</span>
            </p>
          </>
        )}
      </>
    </Section>
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

function HourPicker({
  hours,
  hour,
  onHourClick,
}: {
  hours: string[][];
  hour?: string;
  onHourClick: (hour: string, duration: number) => void;
}) {
  return (
    <Section title="Available hours">
      <ul className="flex flex-wrap gap-[16px]">
        {hours.map(([hourStr, end], index) => {
          const duration = subtractTimeStrings(hourStr, end);
          return (
            <li key={index}>
              <HourCard
                hour={hourStr}
                duration={duration}
                onHourClick={onHourClick}
                highlight={!!hour && hourStr === hour}
              />
            </li>
          );
        })}
      </ul>
    </Section>
  );
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

function Information({ bio }: { bio: string }) {
  return (
    <Section title="Information">
      <p className="text-base leading-relaxed text-gray">{bio}</p>
    </Section>
  );
}

function Column({ children, className }: { children: React.ReactNod; className: string }) {
  return <div className={cn("space-y-8", className)}>{children}</div>;
}

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="mb-8 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
