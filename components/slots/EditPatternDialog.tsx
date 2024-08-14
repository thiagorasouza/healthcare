import PatternForm from "@/components/slots/PatternForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreatePatternResult } from "@/lib/actions/createPattern";
import { UpdatePatternResult } from "@/lib/actions/updatePattern";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";

interface EditPatternDialogProps {
  doctorId: string;
  data: PatternDocumentSchema;
  open: boolean;
  onCloseClick: () => void;
  onSaveClick: (form: FormData) => Promise<CreatePatternResult | UpdatePatternResult>;
  onSuccess: (patternData: PatternDocumentSchema) => void;
}

export function EditPatternDialog({
  doctorId,
  data,
  open,
  onCloseClick,
  onSaveClick,
  onSuccess,
}: EditPatternDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onCloseClick}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Pattern</DialogTitle>
          <DialogDescription>Modify current pattern details</DialogDescription>
        </DialogHeader>
        <PatternForm
          patternData={data}
          doctorId={doctorId}
          action={onSaveClick}
          onSuccess={onSuccess}
          submitLabel="Save"
        />
      </DialogContent>
    </Dialog>
  );
}
