import { TimePickerField } from "@/components/forms/TimePickerField";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PatternData } from "@/lib/schemas/patternsSchema";
import { UseFormReturn } from "react-hook-form";

interface TimeFieldProps {
  form: UseFormReturn<PatternData>;
  label: string;
  name: keyof PatternData;
  description: string;
}

export default function TimeField({ form, label, name, description }: TimeFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-[120px]">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <TimePickerField date={field.value as Date} setDate={field.onChange} />
          </FormControl>
          <FormDescription className="text-xs">{description}</FormDescription>
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
}
