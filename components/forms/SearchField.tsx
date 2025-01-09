import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Anchor } from "@radix-ui/react-popover";
import { Search } from "lucide-react";
import React, { ReactNode, ChangeEvent, useState, useEffect, useRef } from "react";
import { UseFormReturn } from "react-hook-form";

export interface SearchFieldOptions {
  value: string;
  label: string;
}

interface SearchFieldProps {
  name: string;
  icon?: ReactNode;
  label?: string;
  placeholder?: string;
  description?: string;
  form: UseFormReturn<any>;
  disabled?: boolean;
  className?: string;
  options: SearchFieldOptions[];
  onSelect: (value: string) => void;
}

const SearchField = ({
  name,
  label,
  placeholder,
  description,
  form,
  disabled = false,
  className,
  options,
  onSelect,
}: SearchFieldProps) => {
  const [open, setOpen] = useState(false);

  const valueLen = form.getValues(name).length;
  const optionsLen = options.length;

  useEffect(() => {
    setOpen(valueLen > 0);
  }, [valueLen, optionsLen]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <div>
              <Popover open={open} onOpenChange={setOpen}>
                <Anchor className="flex items-center rounded-md border border-input pl-3">
                  <Search className="h-4 w-4" />
                  <Input
                    {...field}
                    data-cy={name}
                    placeholder={placeholder}
                    disabled={disabled || form.formState.isSubmitting}
                    className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </Anchor>
                <PopoverContent
                  className="w-[550px] p-0"
                  onOpenAutoFocus={(e) => e.preventDefault()}
                >
                  <Command>
                    <CommandList>
                      <CommandEmpty className="pb-2 pt-4">No results found.</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="cursor-pointer"
                            onSelect={() => {
                              onSelect(option.value);
                              form.setValue(name, "");
                            }}
                          >
                            {option.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
};

export default SearchField;
