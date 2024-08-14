import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface SubmitButtonProps {
  form: UseFormReturn<any>;
  label: string;
  className?: string;
}

const SubmitButton = ({ form, label, className }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      data-cy="submit"
      className={cn("w-full", className)}
      disabled={form.formState.isSubmitting}
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
