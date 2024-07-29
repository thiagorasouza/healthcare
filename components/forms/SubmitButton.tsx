import { Button } from "@/components/ui/button";
import React from "react";
import { UseFormReturn } from "react-hook-form";

const SubmitButton = ({
  form,
  label,
}: {
  form: UseFormReturn<any>;
  label: string;
}) => {
  return (
    <Button
      type="submit"
      data-cy="submit"
      className="mt-2 w-full md:mt-4"
      disabled={form.formState.isSubmitting}
    >
      {label}
    </Button>
  );
};

export default SubmitButton;
