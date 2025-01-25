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
}

export function CreatePatternDialog({ open, setOpen, onSaved }: CreatePatternDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Pattern</DialogTitle>
          <DialogDescription>Add slots for a single date or a recurring pattern</DialogDescription>
        </DialogHeader>
        <PatternForm mode="create" onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
