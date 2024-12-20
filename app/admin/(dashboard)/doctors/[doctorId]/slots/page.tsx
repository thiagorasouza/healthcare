"use client";

import DoctorCard from "@/components/doctors/DoctorCard";
import SlotsCard from "@/components/slots/SlotsCard";
import { getDoctor } from "@/lib/actions/getDoctor";
import { getPatterns } from "@/lib/actions/getPatterns";
import { useCallback, useEffect, useState } from "react";
import { DoctorDataUpdate } from "@/lib/schemas/doctorsSchema";
import { PatternDocumentListSchema, PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import PatternCard from "@/components/slots/PatternCard";
import { deletePattern } from "@/lib/actions/deletePattern";
import { toast } from "sonner";
import { EditPatternDialog } from "@/components/slots/EditPatternDialog";
import { updatePattern } from "@/lib/actions/updatePattern";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { CreatePatternDialog } from "@/components/slots/CreatePatternDialog";
import { createPattern } from "@/lib/actions/createPattern";
import DeleteDialog from "@/components/shared/DeleteDialog";

export default function SlotsPage({ params }: { params: { doctorId: string } }) {
  const [selectedPattern, setSelectedPattern] = useState<PatternDocumentSchema>();
  const [doctor, setDoctor] = useState<DoctorDataUpdate>();
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [slots, setSlots] = useState<PatternDocumentListSchema>();
  const [slotsLoading, setSlotsLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { doctorId } = params;

  const loadDoctors = useCallback(
    async function () {
      setDoctorLoading(true);
      const doctorResult = await getDoctor(doctorId);
      if (doctorResult.success && doctorResult.data) {
        setDoctor(doctorResult.data);
      }
      setDoctorLoading(false);
    },
    [doctorId],
  );

  const loadSlots = useCallback(
    async function () {
      setSlotsLoading(true);
      const slotsResult = await getPatterns(doctorId);
      if (slotsResult.success && slotsResult.data) {
        setSlots(slotsResult.data);
      }
      setSlotsLoading(false);
    },
    [doctorId],
  );

  useEffect(() => {
    loadDoctors();
    loadSlots();
  }, [loadDoctors, loadSlots]);

  async function deleteSelectedPattern() {
    if (!selectedPattern) return;

    const patternId = selectedPattern.$id;
    const result = await deletePattern(patternId);
    if (!result.success) {
      toast(`Unable to delete pattern ${patternId} at this time`);
      return;
    }

    loadSlots();
    setSelectedPattern(undefined);
  }

  function onSuccess(patternData: PatternDocumentSchema) {
    loadSlots();
    setSelectedPattern(patternData);
    setEditDialogOpen(false);
    setCreateDialogOpen(false);
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <nav className="flex items-center justify-between">
        {doctor && <AdminBreadcrumb replace={doctorId} replacement={doctor.name} />}
        <Button
          size="sm"
          className="ml-auto flex h-8 w-fit items-center gap-2"
          onClick={() => setCreateDialogOpen(true)}
        >
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sm:whitespace-nowrap">Add Slot</span>
        </Button>
      </nav>
      <div className="grid grid-cols-3 items-start gap-8">
        <div className="col-span-2 flex flex-col gap-8 self-start">
          <DoctorCard data={doctor} loading={doctorLoading} />
          <SlotsCard
            data={slots}
            loading={slotsLoading}
            onSlotClick={setSelectedPattern}
            onCreateClick={() => setCreateDialogOpen(true)}
          />
        </div>
        <div className="col-span-1">
          <DrawerAnimation toggle={!!selectedPattern}>
            <PatternCard
              data={selectedPattern}
              onCloseClick={() => setSelectedPattern(undefined)}
              onDeleteClick={() => setDeleteDialogOpen(true)}
              onEditClick={() => setEditDialogOpen(true)}
            />
          </DrawerAnimation>
        </div>
        {selectedPattern && (
          <EditPatternDialog
            doctorId={doctorId}
            data={selectedPattern}
            open={editDialogOpen}
            onCloseClick={() => setEditDialogOpen(false)}
            onSaveClick={updatePattern}
            onSuccess={onSuccess}
          />
        )}
        <CreatePatternDialog
          doctorId={doctorId}
          open={createDialogOpen}
          onCloseClick={() => setCreateDialogOpen(false)}
          onSaveClick={createPattern}
          onSuccess={onSuccess}
        />
        <DeleteDialog
          type="pattern"
          item={selectedPattern?.$id}
          open={deleteDialogOpen}
          onCloseClick={() => setDeleteDialogOpen(false)}
          onContinue={deleteSelectedPattern}
        />
      </div>
    </div>
  );
}
