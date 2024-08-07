import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { AvailabilityData } from "@/lib/schemas/availabilitySchema";

type DateKeys = {
  [K in keyof AvailabilityData]: AvailabilityData[K] extends Date ? K : never;
}[keyof AvailabilityData];

interface DateFieldProps<T> {
  name: DateKeys;
  label: string;
  placeholder: string;
  description?: string;
  form: UseFormReturn<AvailabilityData>;
  onSelect: (date?: Date) => Date | undefined;
  disabled: (date: Date) => boolean;
}

export default function DateField<T>({
  name,
  label,
  placeholder,
  description,
  form,
  onSelect,
  disabled,
}: DateFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="mb-1">{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(field.value, "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => field.onChange(onSelect(date))}
                required={true}
                initialFocus
                disabled={disabled}
              />
            </PopoverContent>
          </Popover>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}