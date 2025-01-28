import { PatternForm } from "@/components/patterns/PatternForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PatternModel } from "@/server/domain/models/patternModel";

export interface PatternEditDialogProps {
  pattern: PatternModel;
  open: boolean;
  setOpen: (open: boolean) => void;
  onSaved?: (pattern: PatternModel) => void;
}

export function PatternEditDialog({ pattern, open, setOpen, onSaved }: PatternEditDialogProps) {
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
