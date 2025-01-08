import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Data {
  id: string;
  description: string;
}

export function useDeleteDialog(deleteData: (id: string) => unknown) {
  const [data, setData] = useState<Data>();
  const [open, setOpen] = useState(false);

  const openDeleteDialog = (data: Data) => {
    setData(data);
    setOpen(true);
  };

  const onDeleteClick = () => {
    setOpen(false);
    deleteData(data!.id);
  };

  const deleteDialog = data ? (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            <p>
              This will permanently delete <strong>{data.description}</strong> from our servers.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onDeleteClick}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ) : null;

  return {
    openDeleteDialog,
    deleteDialog,
  };
}
