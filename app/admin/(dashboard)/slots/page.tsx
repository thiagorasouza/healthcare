"use client";

import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { SearchDoctorForm } from "@/components/slots/SearchDoctorForm";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { getPatterns } from "@/server/actions/getPatterns.bypass";
import { getSlots } from "@/server/actions/getSlots";
import { fullWeekdays } from "@/server/config/constants";
import { DoctorModel } from "@/server/domain/models/doctorModel";
import { PatternModel, Weekday } from "@/server/domain/models/patternModel";
import { SlotsModel } from "@/server/domain/models/slotsModel";
import { getHoursStr } from "@/server/useCases/shared/helpers/date";
import {
  countSlotsInTimespan,
  formatList,
  objectToFormData,
} from "@/server/useCases/shared/helpers/utils";
import { format } from "date-fns";
import { CalendarDays, Clock, Hourglass, Repeat2, Target } from "lucide-react";
import { useMemo, useState } from "react";

export default function SlotsPage() {
  const [doctor, setDoctor] = useState<DoctorModel | "error">();
  const [slots, setSlots] = useState<SlotsModel | "error">();
  const [patterns, setPatterns] = useState<PatternModel[] | "error">();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedHour, setSelectedHour] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadDoctorSlots(doctor: DoctorModel) {
    setLoading(true);
    try {
      const doctorId = doctor.id;
      setDoctor(doctor);

      const slotsResult = await getSlots(
        objectToFormData({
          doctorId,
          startDate: new Date(),
        }),
      );
      if (!slotsResult.ok) {
        setSlots("error");
        return;
      }
      setSlots(slotsResult.value);

      const patternsResults = await getPatterns(objectToFormData({ id: doctorId }));
      console.log("🚀 ~ patternsResults:", patternsResults);
      if (!patternsResults.ok) {
        setPatterns("error");
        return;
      }
      setPatterns(patternsResults.value);
    } catch (error) {
      console.log(error);
      setDoctor("error");
      setSlots("error");
      setPatterns("error");
    } finally {
      setLoading(false);
    }
  }

  const idle = !doctor || !slots || !patterns;
  const error = doctor === "error" || slots === "error" || patterns === "error";

  const dates = useMemo(() => {
    if (idle || error) return [];
    return [...slots.keys()];
  }, [slots, error, idle]);

  const hours = useMemo(() => {
    const dateStr = selectedDate && selectedDate.toISOString();
    if (idle || error || !dateStr || !slots.has(dateStr)) return [];

    const hours = slots.get(dateStr) as string[][];

    return hours;
  }, [selectedDate, idle, error, slots]);

  if (error) {
    return <ErrorCard text="There was an error while trying to load this page." />;
  }

  return (
    <DefaultCard
      title="Slots"
      description="Select a doctor to manage available slots"
      className="mx-auto max-w-[800px]"
    >
      <SearchDoctorForm onSelect={loadDoctorSlots} className="mb-6" />
      {loading && (
        <div className="flex items-center justify-center py-4">
          <LoadingSpinner />
        </div>
      )}
      {!idle && !loading && (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold">Patterns:</p>
            <div className="flex grow-0">
              {patterns.map((pattern) => (
                <Pattern key={pattern.id} pattern={pattern} />
              ))}
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Dates:</p>
              <div className="w-max rounded-md border shadow-md">
                <DateTimePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  granularity="day"
                  className="w-full"
                  noPopover={true}
                  type="future"
                  {...(dates.length > 0
                    ? {
                        startMonth: new Date(dates[0]),
                        endMonth: new Date(dates[dates.length - 1]),
                        disabledFn: (date) => !dates.includes(date.toISOString()),
                      }
                    : { disabledFn: () => true })}
                />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Hours:</p>
              <Hours hours={hours} onSelect={setSelectedHour} selectedHour={selectedHour} />
            </div>
          </div>
        </div>
      )}
    </DefaultCard>
  );
}

export function Pattern({ pattern }: { pattern: PatternModel }) {
  const slotsNum = countSlotsInTimespan(pattern.startTime, pattern.endTime, pattern.duration);
  const recurring = pattern.recurring;
  return (
    <div className="flex cursor-pointer flex-col gap-2 rounded-md border p-4 text-sm shadow-md transition-transform hover:scale-105 [&>div]:flex [&>div]:items-center [&_svg]:mr-3 [&_svg]:h-4 [&_svg]:w-4">
      <div className="font-semibold">
        <CalendarDays />
        {format(pattern.startDate, "PPP")}
        {recurring && <span>&rarr; {format(pattern.endDate, "PPP")}</span>}
      </div>
      {recurring && (
        <div>
          <Target />
          {formatList((pattern.weekdays as Weekday[]).map((w) => fullWeekdays[w]))}
        </div>
      )}
      <div>
        <Clock />
        {getHoursStr(new Date(pattern.startTime))} &rarr; {getHoursStr(new Date(pattern.endTime))} (
        {slotsNum} slots per day)
      </div>
      <div>
        <Hourglass />
        {pattern.duration} minutes each
      </div>
      <div className="font-semibold">
        <Repeat2 />
        {recurring ? "Recurring" : "Non recurring"}
      </div>
    </div>
  );
}

export function Hours({
  hours,
  selectedHour,
  onSelect,
}: {
  hours: string[][];
  selectedHour: string;
  onSelect: (hour: string) => void;
}) {
  return (
    <ul className="flex flex-wrap gap-3 text-center text-sm">
      {hours.map((hour, index) => (
        <li
          key={index}
          onClick={() => onSelect(hour[0])}
          className={cn(
            "w-[70px] cursor-pointer rounded-md border border-input px-3 py-2 transition-transform hover:scale-105 hover:border-black hover:bg-light-yellow",
            {
              "bg-accent": hour[0] === selectedHour,
            },
          )}
        >
          {hour[0]}
        </li>
      ))}
    </ul>
  );
}

// "use client";

// import DoctorCard from "@/components/doctors/DoctorCard";
// import SlotsCard from "@/components/slots/SlotsCard";
// import { getPatterns } from "@/lib/actions/getPatterns";
// import { useCallback, useEffect, useState } from "react";
// import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
// import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
// import PatternCard from "@/components/slots/PatternCard";
// import { deletePattern } from "@/lib/actions/deletePattern";
// import { toast } from "sonner";
// import { EditPatternDialog } from "@/components/slots/EditPatternDialog";
// import { updatePattern } from "@/lib/actions/updatePattern";
// import { Button } from "@/components/ui/button";
// import { PlusCircle } from "lucide-react";
// import DrawerAnimation from "@/components/shared/DrawerAnimation";
// import { CreatePatternDialog } from "@/components/slots/CreatePatternDialog";
// import { createPattern } from "@/lib/actions/createPattern";
// import { getDoctor } from "@/server/actions/getDoctor.bypass";
// import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb";

// export default function SlotsPage({ params }: { params: { doctorId: string } }) {
//   const [selectedPattern, setSelectedPattern] = useState<PatternDocumentSchema>();
//   const [doctor, setDoctor] = useState<DoctorDataUpdate>();
//   const [doctorLoading, setDoctorLoading] = useState(true);
//   const [slots, setSlots] = useState<PatternDocumentListSchema>();
//   const [slotsLoading, setSlotsLoading] = useState(true);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [createDialogOpen, setCreateDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

//   const { doctorId } = params;

//   const loadDoctors = useCallback(
//     async function () {
//       setDoctorLoading(true);
//       const doctorResult = await getDoctor(doctorId);
//       if (doctorResult.success && doctorResult.data) {
//         setDoctor(doctorResult.data);
//       }
//       setDoctorLoading(false);
//     },
//     [doctorId],
//   );

//   const loadSlots = useCallback(
//     async function () {
//       setSlotsLoading(true);
//       const slotsResult = await getPatterns(doctorId);
//       if (slotsResult.success && slotsResult.data) {
//         setSlots(slotsResult.data);
//       }
//       setSlotsLoading(false);
//     },
//     [doctorId],
//   );

//   useEffect(() => {
//     loadDoctors();
//     loadSlots();
//   }, [loadDoctors, loadSlots]);

//   async function deleteSelectedPattern() {
//     if (!selectedPattern) return;

//     const patternId = selectedPattern.$id;
//     const result = await deletePattern(patternId);
//     if (!result.success) {
//       toast(`Unable to delete pattern ${patternId} at this time`);
//       return;
//     }

//     loadSlots();
//     setSelectedPattern(undefined);
//   }

//   function onSuccess(patternData: PatternDocumentSchema) {
//     loadSlots();
//     setSelectedPattern(patternData);
//     setEditDialogOpen(false);
//     setCreateDialogOpen(false);
//   }

//   return (
//     <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
//       <nav className="flex items-center justify-between">
//         {doctor && <AdminBreadcrumb replace={doctorId} replacement={doctor.name} />}
//         <Button
//           size="sm"
//           className="ml-auto flex h-8 w-fit items-center gap-2"
//           onClick={() => setCreateDialogOpen(true)}
//         >
//           <PlusCircle className="h-3.5 w-3.5" />
//           <span className="sm:whitespace-nowrap">Add Slot</span>
//         </Button>
//       </nav>
//       <div className="grid grid-cols-3 items-start gap-8">
//         <div className="col-span-2 flex flex-col gap-8 self-start">
//           <DoctorCard data={doctor} loading={doctorLoading} />
//           <SlotsCard
//             data={slots}
//             loading={slotsLoading}
//             onSlotClick={setSelectedPattern}
//             onCreateClick={() => setCreateDialogOpen(true)}
//           />
//         </div>
//         <div className="col-span-1">
//           <DrawerAnimation toggle={!!selectedPattern}>
//             <PatternCard
//               data={selectedPattern}
//               onCloseClick={() => setSelectedPattern(undefined)}
//               onDeleteClick={() => setDeleteDialogOpen(true)}
//               onEditClick={() => setEditDialogOpen(true)}
//             />
//           </DrawerAnimation>
//         </div>
//         {selectedPattern && (
//           <EditPatternDialog
//             doctorId={doctorId}
//             data={selectedPattern}
//             open={editDialogOpen}
//             onCloseClick={() => setEditDialogOpen(false)}
//             onSaveClick={updatePattern}
//             onSuccess={onSuccess}
//           />
//         )}
//         <CreatePatternDialog
//           doctorId={doctorId}
//           open={createDialogOpen}
//           onCloseClick={() => setCreateDialogOpen(false)}
//           onSaveClick={createPattern}
//           onSuccess={onSuccess}
//         />
//         {/* <DeleteDialog
//           itemType="pattern"
//           itemName={selectedPattern?.$id}
//           open={deleteDialogOpen}
//           onCloseClick={() => setDeleteDialogOpen(false)}
//           onConfirmationClick={deleteSelectedPattern}
//         /> */}
//       </div>
//     </div>
//   );
// }
