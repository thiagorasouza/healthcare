import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface SubmitButtonProps {
  form: UseFormReturn<any>;
  label: string;
  className?: string;
  disabled?: boolean;
  outline?: boolean;
}

const SubmitButton = ({ form, label, className, disabled, outline = false }: SubmitButtonProps) => {
  return (
    <Button
      id="step-submit-button"
      type="submit"
      variant={outline ? "outline" : "default"}
      data-cy="submit"
      className={cn("w-full", className)}
      disabled={form.formState.isSubmitting || disabled}
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
