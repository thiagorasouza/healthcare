import React from "react";
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

interface DeleteDialogProps {
  type: string;
  item?: string;
  open: boolean;
  onCloseClick: () => void;
  onContinue: () => void;
}

export default function DeleteDialog({
  type,
  item,
  open,
  onCloseClick,
  onContinue,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCloseClick()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {item ? (
              <p>
                This will permanently delete the following data from our servers:
                <br />
                <strong>{item ? `${type} ${item}` : `this ${type}`}</strong>
              </p>
            ) : (
              <p>This will permanently delete this {type} from our servers</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onContinue}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
