import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import React from "react";

const FormMessage = ({ message }: { message: string }) => {
  return (
    <Alert
      variant="destructive"
      className={cn("mb-4 text-sm leading-none", {
        hidden: message === "",
      })}
    >
      <ExclamationTriangleIcon className="h-4 w-4" />
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
};

export default FormMessage;
