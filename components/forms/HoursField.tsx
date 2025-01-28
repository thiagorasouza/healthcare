import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn, subtractTimeStrings } from "@/lib/utils";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

interface HoursFieldLoadingProps {
  name: string;
  label?: string;
  loading: true;
  hours?: string[][];
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
  defaultValue?: string;
}

interface HoursFieldProps {
  name: string;
  label?: string;
  loading: false;
  hours: string[][];
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
  className?: string;
}

const HoursField = ({
  name,
  label,
  loading,
  hours,
  placeholder,
  description,
  form,
  className,
}: HoursFieldProps | HoursFieldLoadingProps) => {
  useEffect(() => {
    const currentHour = form.getValues(name);
    if (loading || currentHour === "") return;

    const hasCurrentHour = hours.some(([hour]) => hour === currentHour);
    if (!hasCurrentHour) {
      form.setValue(name, "");
    }
  }, [name, loading, hours, form]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            {Array.isArray(hours) && hours.length > 0 ? (
              <ul
                className={cn(
                  "grid grid-cols-4 gap-3 text-center text-sm md:grid-cols-5 lg:grid-cols-7",
                )}
              >
                {hours.map((hour, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      if (form.formState.isSubmitting) return;
                      form.setValue(name, hour[0], { shouldValidate: true });
                      form.setValue("duration", subtractTimeStrings(hour[0], hour[1]));
                    }}
                    className={cn(
                      "cursor-pointer rounded-md border border-input px-3 py-2 transition-transform",
                      {
                        "bg-accent": hour[0] === field.value,
                        "hover:scale-105 hover:border-black hover:bg-light-yellow":
                          !form.formState.isSubmitting,
                      },
                    )}
                  >
                    {hour[0]}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="w-full rounded-md border border-input px-3 py-2 text-sm">
                {loading ? "..." : placeholder}
              </p>
            )}
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default HoursField;
