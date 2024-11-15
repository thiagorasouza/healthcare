import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { OctagonX } from "lucide-react";

export function ErrorDialog({ message }: { message: string }) {
  return (
    <Dialog defaultOpen={true}>
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
