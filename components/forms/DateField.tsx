import { UseFormReturn } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateTimePicker, RangeType, Side } from "@/components/ui/datetime-picker";
import { cn } from "@/lib/utils";
import { setToMidnightUTC } from "@/server/useCases/shared/helpers/date";

interface DateFieldProps {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
  disabledFn?: (date: Date) => boolean;
  onSelect?: (date: Date | undefined) => void;
  startMonth?: Date;
  endMonth?: Date;
  side?: Side;
  type?: RangeType;
  yearRange?: number;
}

export default function DateField({
  name,
  label,
  placeholder,
  description,
  form,
  className,
  disabledFn,
  onSelect,
  startMonth,
  endMonth,
  side,
  type,
  yearRange,
}: DateFieldProps) {
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
            onSelect={onSelect}
            disabledFn={disabledFn}
            startMonth={startMonth}
            endMonth={endMonth}
            side={side}
            type={type}
            yearRange={yearRange}
            disabled={form.formState.isSubmitting}
          />
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
