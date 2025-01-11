import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { OctagonX } from "lucide-react";
import { useState } from "react";

export function ErrorDialog({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (msg: string) => void;
}) {
  return (
    <Dialog
      open={!!message}
      onOpenChange={(open) => {
        if (!open) setMessage("");
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="mb-3 flex items-center text-lg">
            <span className="text-red-400">
              <OctagonX className="mr-2 h-5 w-5" />
            </span>
            Sorry, there was an error
          </DialogTitle>
          <DialogDescription className="text-base">{message}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
