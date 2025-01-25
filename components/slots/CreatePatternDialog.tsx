import { PatternForm } from "@/components/slots/PatternForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatternModel } from "@/server/domain/models/patternModel";

export interface CreatePatternDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved?: (pattern: PatternModel) => void;
  doctorId: string;
}

export function CreatePatternDialog({
  open,
  setOpen,
  onSaved,
  doctorId,
}: CreatePatternDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Pattern</DialogTitle>
          <DialogDescription>Add slots for a single date or a recurring pattern</DialogDescription>
        </DialogHeader>
        <PatternForm mode="create" doctorId={doctorId} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
