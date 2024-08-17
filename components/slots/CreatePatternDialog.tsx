import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PatternForm from "@/components/slots/PatternForm";
import { CreatePatternResult } from "@/lib/actions/createPattern";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";

interface CreatePatternDialog {
  doctorId: string;
  open: boolean;
  onCloseClick: () => void;
  onSaveClick: (form: FormData) => Promise<CreatePatternResult>;
  onSuccess: (patternData: PatternDocumentSchema) => void;
}

export function CreatePatternDialog({
  doctorId,
  open,
  onCloseClick,
  onSaveClick,
  onSuccess,
}: CreatePatternDialog) {
  return (
    <Dialog open={open} onOpenChange={onCloseClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Pattern</DialogTitle>
          <DialogDescription>Add slots for a single date or recurring pattern</DialogDescription>
        </DialogHeader>
        <PatternForm
          doctorId={doctorId}
          action={onSaveClick}
          onSuccess={onSuccess}
          submitLabel="Save"
        />
      </DialogContent>
    </Dialog>
  );
}
