import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { PatternData } from "@/lib/schemas/patternsSchema";
import { UseFormReturn } from "react-hook-form";

interface ToggleFieldProps {
  form: UseFormReturn<PatternData>;
  labelOn: string;
  descriptionOn: string;
  labelOff: string;
  descriptionOff: string;
  name: keyof PatternData;
}

export default function ToggleField({
  form,
  labelOn,
  labelOff,
  descriptionOn,
  descriptionOff,
  name,
}: ToggleFieldProps) {
  const on = form.getValues(name) as boolean;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between">
          <div className="space-y-0.5">
            <FormLabel>{on ? labelOn : labelOff}</FormLabel>
            <FormDescription className="text-xs">
              {on ? descriptionOn : descriptionOff}
            </FormDescription>
          </div>
          <FormControl>
            <Switch checked={field.value as boolean} onCheckedChange={field.onChange} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}
