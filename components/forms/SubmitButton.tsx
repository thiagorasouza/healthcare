import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface SubmitButtonProps {
  form: UseFormReturn<any>;
  label: string;
  className?: string;
  disabled?: boolean;
}

const SubmitButton = ({ form, label, className, disabled }: SubmitButtonProps) => {
  return (
    <Button
      type="submit"
      data-cy="submit"
      className={cn("w-full", className)}
      disabled={form.formState.isSubmitting || disabled}
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
