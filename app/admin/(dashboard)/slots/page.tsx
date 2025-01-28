"use client";

import DefaultCard from "@/components/shared/DefaultCard";
import ErrorCard from "@/components/shared/ErrorCard";
import { PatternCreateDialog } from "@/components/patterns/PatternCreateDialog";
import { PatternEditDialog } from "@/components/patterns/PatternEditDialog";
import { SearchDoctorForm } from "@/components/patterns/SearchDoctorForm";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useDeleteDialog } from "@/lib/hooks/useDeleteDialog";
import { deletePattern } from "@/server/actions/deletePattern.bypass";
import { getPatterns } from "@/server/actions/getPatterns.bypass";
import { getSlots } from "@/server/actions/getSlots";
import { fullWeekdays } from "@/server/config/constants";
import { displayError } from "@/server/config/errors";
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
import {
  CalendarDays,
  CirclePlus,
  Clock,
  Hourglass,
  Repeat2,
  SquarePen,
  Target,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminBreadcrumbWithBackLink } from "@/components/admin/AdminBreadcrumbWithBackLink";

export default function SlotsPage() {
  const [doctor, setDoctor] = useState<DoctorModel | "error">();
  const [slots, setSlots] = useState<SlotsModel | "error">();
  const [patterns, setPatterns] = useState<PatternModel[] | "error">();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedPattern, setSelectedPattern] = useState<PatternModel>();
  const [loading, setLoading] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { openDeleteDialog, deleteDialog } = useDeleteDialog(handleDelete);

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
      if (!patternsResults.ok) {
        setPatterns("error");
        return;
      }
      setPatterns(patternsResults.value);
      setSelectedDate(new Date(slotsResult.value.keys().next().value as string));
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

  function editPatternClick(pattern: PatternModel) {
    setSelectedPattern(pattern);
    setEditDialogOpen(true);
  }

  function createPatternClick() {
    setCreateDialogOpen(true);
  }

  function onPatternSaved() {
    setEditDialogOpen(false);
    loadDoctorSlots(doctor as DoctorModel);
  }

  function onPatternCreated(pattern: PatternModel) {
    setCreateDialogOpen(false);
    loadDoctorSlots(doctor as DoctorModel);
  }

  async function handleDelete(id: string) {
    try {
      const deleteResult = await deletePattern(objectToFormData({ id }));
      if (!deleteResult.ok) {
        toast(displayError(deleteResult));
        return;
      }

      toast("Pattern deleted successfully.");
      loadDoctorSlots(doctor as DoctorModel);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {}, []);

  if (error) {
    return <ErrorCard text="There was an error while trying to load this page." />;
  }

  return (
    <>
      {doctor && (
        <PatternCreateDialog
          open={createDialogOpen}
          setOpen={setCreateDialogOpen}
          onSaved={onPatternCreated}
          doctorId={doctor.id}
        />
      )}
      {selectedPattern && (
        <PatternEditDialog
          pattern={selectedPattern}
          open={editDialogOpen}
          setOpen={setEditDialogOpen}
          onSaved={onPatternSaved}
        />
      )}
      {deleteDialog}
      <div className="mx-auto w-full max-w-[800px] space-y-4">
        <AdminBreadcrumbWithBackLink backLink="/admin" />
        <DefaultCard title="Slots" description="Select a doctor to manage available slots">
          <SearchDoctorForm onSelect={loadDoctorSlots} className="mb-6" />
          {loading && (
            <div className="flex items-center justify-center py-4">
              <LoadingSpinner />
            </div>
          )}
          {!idle && !loading && (
            <div className="flex flex-col gap-6">
              <div className="flex gap-6">
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-semibold">All Dates:</p>
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
                  <Hours hours={hours} />
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sm font-semibold">Patterns:</p>
                <div className="grid grid-cols-2 gap-6">
                  {patterns.map((pattern) => (
                    <Pattern
                      key={pattern.id}
                      pattern={pattern}
                      onEditClick={editPatternClick}
                      openDeleteDialog={openDeleteDialog}
                    />
                  ))}
                  <div
                    className="group flex cursor-pointer items-center justify-center gap-2 rounded-md border px-8 py-4 text-sm shadow-md"
                    onClick={createPatternClick}
                  >
                    <CirclePlus className="h-5 w-5 transition-all group-hover:scale-110" />
                    <div className="text-base font-semibold">New pattern</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DefaultCard>
      </div>
    </>
  );
}

function Pattern({
  pattern,
  onEditClick,
  openDeleteDialog,
}: {
  pattern: PatternModel;
  onEditClick: (pattern: PatternModel) => void;
  openDeleteDialog: ({ id, description }: { id: string; description: string }) => void;
}) {
  const slotsNum = countSlotsInTimespan(pattern.startTime, pattern.endTime, pattern.duration);
  const recurring = pattern.recurring;
  const deleteDescription = `${format(pattern.startDate, "PPP")} pattern`;
  return (
    <div className="flex h-full flex-col gap-2 rounded-md border p-4 text-sm shadow-md">
      <div className="flex items-center gap-2 font-semibold">
        <CalendarDays className="h-4 w-4" />
        <span>{format(pattern.startDate, "PPP")}</span>
        {recurring && (
          <>
            <span>&rarr;</span>
            <span>{format(pattern.endDate, "PPP")}</span>
          </>
        )}
      </div>
      {recurring && (
        <div className="flex items-center gap-3">
          <Target className="h-4 w-4" />
          {formatList((pattern.weekdays as Weekday[]).map((w) => fullWeekdays[w]))}
        </div>
      )}
      <div className="flex items-center gap-3">
        <Clock className="h-4 w-4" />
        {getHoursStr(new Date(pattern.startTime))} &rarr; {getHoursStr(new Date(pattern.endTime))} (
        {slotsNum} slots per day)
      </div>
      <div className="flex items-center gap-3">
        <Hourglass className="h-4 w-4" />
        {pattern.duration} minutes each
      </div>
      <div className="flex items-center gap-3 font-semibold">
        <Repeat2 className="h-4 w-4" />
        {recurring ? "Recurring" : "Non recurring"}
      </div>
      <div className="mt-auto flex gap-2">
        <Button
          size="sm"
          // variant="outline"
          className="flex-1"
          onClick={() => onEditClick(pattern)}
        >
          <SquarePen className="h-4 w-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            openDeleteDialog({
              id: pattern.id,
              description: deleteDescription,
            })
          }
          className="flex-1"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>
    </div>
  );
}

function Hours({ hours }: { hours: string[][] }) {
  return (
    <ul className="flex flex-wrap gap-3 text-center text-sm">
      {hours.map((hour, index) => (
        <li
          key={index}
          className="w-[70px] rounded-md border border-input px-3 py-2 transition-transform"
        >
          {hour[0]}
        </li>
      ))}
    </ul>
  );
}
