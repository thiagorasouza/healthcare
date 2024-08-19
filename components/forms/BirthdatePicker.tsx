import { UseFormReturn } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";

interface BirthdateFieldProps {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
}

export default function BirthdateField<T>({
  name,
  label,
  placeholder,
  description,
  form,
  className,
}: BirthdateFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col gap-1", className)}>
          <FormLabel>{label}</FormLabel>
          <DateTimePicker
            granularity="day"
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            className="w-full"
          />
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
