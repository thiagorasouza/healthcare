import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface TextareaFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  form: UseFormReturn<any>;
}

const TextareaField = ({
  name,
  label,
  placeholder,
  form,
}: TextareaFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Textarea
              data-cy="bio"
              placeholder={placeholder}
              readOnly={form.formState.isSubmitting}
              {...field}
            />
          </FormControl>

          <FormDescription className="text-xs">
            Characters count: <strong>{field.value.length}/150</strong>
          </FormDescription>

          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default TextareaField;
