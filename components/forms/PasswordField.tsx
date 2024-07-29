import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface PasswordFieldProps {
  name: string;
  label: string;
  description?: string;
  form: UseFormReturn<any>;
}

const PasswordField = ({
  name,
  label,
  description,
  form,
}: PasswordFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="password"
              data-cy={name}
              placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
              readOnly={form.formState.isSubmitting}
              {...field}
            />
          </FormControl>
          {description && (
            <FormDescription className="text-xs">{description}</FormDescription>
          )}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default PasswordField;
