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
import React, { ReactElement, ReactNode } from "react";
import { UseFormReturn } from "react-hook-form";

interface TextFieldProps {
  name: string;
  icon?: ReactElement;
  label?: string;
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
}

const TextField = ({
  name,
  icon,
  label,
  placeholder,
  description,
  form,
  className,
}: TextFieldProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {icon ? (
              <div className="flex items-center rounded-md border border-input pl-3">
                {React.cloneElement(icon, { className: "h-4 w-4" })}
                <Input
                  data-cy={name}
                  placeholder={placeholder}
                  readOnly={form.formState.isSubmitting}
                  {...field}
                  className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            ) : (
              <Input
                data-cy={name}
                placeholder={placeholder}
                readOnly={form.formState.isSubmitting}
                {...field}
              />
            )}
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default TextField;
