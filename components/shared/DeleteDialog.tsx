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
  itemType: string;
  itemName?: string;
  itemId: string;
  open: boolean;
  onCloseClick: () => void;
  onConfirmationClick: (id: string) => unknown;
}

export default function DeleteDialog({
  itemType,
  itemName,
  itemId,
  open,
  onCloseClick,
  onConfirmationClick,
}: DeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCloseClick()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {itemName ? (
              <p>
                This will permanently delete{" "}
                <strong>{itemName ? `${itemType} ${itemName}` : `this ${itemType}`}</strong> data
                from our servers.
              </p>
            ) : (
              <p>This will permanently delete this {itemType} from our servers</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirmationClick(itemId)}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
