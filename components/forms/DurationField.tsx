import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AvailabilityData } from "@/lib/schemas/availabilitySchema";
import { UseFormReturn } from "react-hook-form";

interface DurationFieldProps {
  form: UseFormReturn<AvailabilityData>;
  label: string;
  name: keyof AvailabilityData;
  description: string;
}

export default function DurationField({ form, label, name, description }: DurationFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-[200px]">
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="flex w-fit gap-2 rounded-md border">
              <Input
                name="duration"
                type="text"
                className="w-[64px] grow-0 border-none text-center font-mono text-base tabular-nums focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                value={field.value as string}
                onChange={(e) => {
                  if (isNaN(Number(e.target.value))) return;
                  field.onChange(e);
                }}
                maxLength={3}
              />
              <div className="flex items-end py-2 pr-6 text-sm">minutes</div>
            </div>
          </FormControl>
          <FormDescription className="text-xs">{description}</FormDescription>
          <FormMessage data-cy={`durationError`} />
        </FormItem>
      )}
    />
  );
}
