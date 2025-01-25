import { PatternForm } from "@/components/slots/PatternForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatternModel } from "@/server/domain/models/patternModel";

export interface EditPatternDialogProps {
  pattern: PatternModel;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved?: (pattern: PatternModel) => void;
}

export function EditPatternDialog({ pattern, open, setOpen, onSaved }: EditPatternDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pattern</DialogTitle>
          <DialogDescription>Modify current pattern parameters</DialogDescription>
        </DialogHeader>
        <PatternForm mode="update" pattern={pattern} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
