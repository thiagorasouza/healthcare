import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { cn } from "@/lib/utils";
import { ArrowUpRight, UserIcon } from "lucide-react";
import Link from "next/link";
import { UseFormReturn } from "react-hook-form";

export interface SelectedPatientLoadingProps {
  loading: true;
  form: UseFormReturn<any>;
  name: string;
  value?: string;
  label?: string;
  placeholder: string;
  link?: string;
  description?: string;
  className?: string;
}

export interface SelectedFieldProps {
  loading: false;
  form: UseFormReturn<any>;
  name: string;
  value: string;
  label: string;
  placeholder: string;
  link: string;
  description?: string;
  className?: string;
}

export function SelectedField({
  loading,
  form,
  name,
  value,
  label,
  placeholder,
  link,
  description,
  className,
}: SelectedPatientLoadingProps | SelectedFieldProps) {
  // useEffect(() => {
  //   if (loading) return;
  //   form.setValue(name, value);
  // }, [loading, name]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <Link
              href={link || "#"}
              target="_blank"
              className="border-1 group flex w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-accent p-3 text-sm"
            >
              {loading ? (
                <>
                  <LoadingSpinner className="h-4 w-4" />
                  <p>Loading...</p>
                </>
              ) : (
                <>
                  <UserIcon className="h-4 w-4" />
                  <p>{placeholder}</p>
                  <div className="ml-auto flex items-center gap-2 pt-[2px]">
                    <p className="text-xs uppercase">VIEW</p>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  </div>
                </>
              )}
            </Link>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
}
