"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

interface RadioFieldProps {
  name: string;
  label: string;
  description?: string;
  options: {
    value: string;
    label: string;
  }[];
  form: UseFormReturn<any>;
  className?: string;
}

export function RadioField({
  name,
  label,
  description,
  options,
  form,
  className,
}: RadioFieldProps) {
  console.log(`Radio field ${name}:`, form.getValues(name));
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", className)}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              value={field.value}
              defaultValue={field.value}
              className="flex gap-3"
            >
              {options.map((option, index) => (
                <FormItem key={index} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <FormLabel className="cursor-pointer">{option.label}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
