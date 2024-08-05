import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { AvailabilityData } from "@/lib/schemas/availabilitySchema";
import { UseFormReturn } from "react-hook-form";

interface ToggleFieldProps {
  form: UseFormReturn<AvailabilityData>;
  label: string;
  name: keyof AvailabilityData;
  description: string;
}

export default function ToggleField({ form, label, name, description }: ToggleFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>{label}</FormLabel>
            <FormDescription className="text-xs">{description}</FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
