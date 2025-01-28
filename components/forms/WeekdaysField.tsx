"use client";

import { UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { capitalize } from "@/lib/utils";
import { weekdays } from "@/server/config/constants";

export function WeekdaysField({ form }: { form: UseFormReturn<any> }) {
  return (
    <FormField
      control={form.control}
      name="weekdays"
      render={() => (
        <FormItem className="mb-9">
          <FormLabel className="mb-3 text-sm font-medium">Weekdays</FormLabel>
          <div className="flex gap-5">
            {weekdays.map((weekday, index) => (
              <FormField
                key={index}
                control={form.control}
                name="weekdays"
                render={({ field }) => {
                  return (
                    <FormItem key={index} className="flex w-fit flex-col items-center">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(weekday)}
                          onCheckedChange={(checked) => {
                            return checked
                              ? field.onChange([...field.value, weekday])
                              : field.onChange(
                                  field.value?.filter((value: any) => value !== weekday),
                                );
                          }}
                        />
                      </FormControl>
                      <FormLabel className="cursor-pointer text-xs">
                        {capitalize(weekday)}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
