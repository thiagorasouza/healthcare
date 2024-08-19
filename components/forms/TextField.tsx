import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import React from "react";
import { UseFormReturn } from "react-hook-form";

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
}

const TextField = ({ name, label, placeholder, description, form, className }: TextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              data-cy={name}
              placeholder={placeholder}
              readOnly={form.formState.isSubmitting}
              {...field}
            />
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default TextField;
