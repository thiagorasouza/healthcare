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

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
}

const TextField = ({
  name,
  label,
  placeholder,
  description,
  form,
}: TextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              data-cy={name}
              placeholder={placeholder}
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

export default TextField;
