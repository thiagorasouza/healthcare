import PatternForm from "@/components/slots/PatternForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Error, Result } from "@/lib/results";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import { PatternData } from "@/lib/schemas/patternsSchema";

interface EditPatternDialogProps {
  doctorId: string;
  data: PatternDocumentSchema;
  open: boolean;
  onCloseClick: () => void;
  onSaveClick: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}

export function EditPatternDialog({
  doctorId,
  data,
  open,
  onCloseClick,
  onSaveClick,
  submitLabel,
}: EditPatternDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCloseClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pattern</DialogTitle>
          <DialogDescription>Modify current pattern details</DialogDescription>
        </DialogHeader>
        <PatternForm data={data} doctorId={doctorId} action={onSaveClick} submitLabel="Save" />
      </DialogContent>
    </Dialog>
  );
}
