import ErrorCard from "@/components/shared/ErrorCard";
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
import { Popover, PopoverContent } from "@/components/ui/popover";
import { useDebouncedCallback } from "@/lib/hooks/useDebouncedCallback";
import { cn } from "@/lib/utils";
import { listPatientsForSearch } from "@/server/actions/listPatientsForSearch";
import { PatientNamePhone } from "@/server/domain/models/patientNamePhone";
import { Anchor } from "@radix-ui/react-popover";
import { ArrowUpRight, Search, UserIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

export interface SearchResult {
  value: string;
  label: string;
}

export interface SelectPatientFieldProps {
  form: UseFormReturn<any>;
  label: string;
  defaultValue: PatientNamePhone;
  description?: string;
  className?: string;
}

export function SelectPatientField({
  form,
  label,
  description,
  defaultValue,
  className,
}: SelectPatientFieldProps) {
  const [patients, setPatients] = useState<PatientNamePhone[] | "error">();
  const [searchResults, setSearhResults] = useState<PatientNamePhone[]>([]);
  const [patient, setPatient] = useState<PatientNamePhone>(defaultValue);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  // === LOADING PATIENTS ===
  async function loadPatients() {
    try {
      const patientsResult = await listPatientsForSearch();
      if (!patientsResult.ok) throw patientsResult.error;

      setPatients(patientsResult.value);
    } catch (error) {
      console.log(error);
      setPatients("error");
    }
  }

  useEffect(() => {
    loadPatients();
  }, []);

  const patientsLoading = !patients;
  const patientsError = patients === "error";

  // === SEARCHING PATIENTS ==
  const searchPatient = useDebouncedCallback(
    (searchValue: string) => {
      if (patientsLoading || patientsError || searchValue.length === 0) {
        setSearhResults([]);
        return;
      }

      const result = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchValue.toLowerCase()),
      );

      setSearhResults(result);
    },
    [patients, patientsLoading, patientsError],
  );

  useEffect(() => {
    // Debounced
    searchPatient(searchValue);
  }, [searchValue, searchPatient]);

  // POPOVER OPENING LOGIC
  useEffect(() => {
    setOpen(searchValue.length > 0);
  }, [searchValue]);

  if (patientsError) {
    return <ErrorCard refresh={true} text="There was an error while trying to load patients" />;
  }

  return (
    <FormField
      control={form.control}
      name="patientId"
      render={() => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <>
              <SelectedPatient patient={patient} />
              <Popover open={open} onOpenChange={setOpen}>
                <Anchor className="flex items-center rounded-md border border-input pl-3">
                  <Search className="h-4 w-4" />
                  <Input
                    id="searchValue"
                    name="searchValue"
                    data-cy="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={
                      patientsLoading
                        ? "Please wait for a few seconds..."
                        : "Type the new patient's name"
                    }
                    disabled={patientsLoading || form.formState.isSubmitting}
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
                        {searchResults.map((patient) => (
                          <CommandItem
                            key={patient.id}
                            className="cursor-pointer"
                            onSelect={() => {
                              setPatient(patient);
                              setSearchValue("");
                              form.setValue("patientId", patient.id);
                            }}
                          >
                            {patient.name} | {patient.phone}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </>
          </FormControl>
          {description && <FormDescription className="text-xs">{description}</FormDescription>}
          <FormMessage data-cy={`${name}Error`} />
        </FormItem>
      )}
    />
  );
}

export const SelectedPatient = React.memo(function SelectedPatient({
  patient,
}: {
  patient: PatientNamePhone;
}) {
  return (
    <Link
      href={`/admin/patients/${patient.id}`}
      target="_blank"
      className="border-1 group flex w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-accent p-3 text-sm"
    >
      <UserIcon className="h-4 w-4" />
      <p>
        {patient.name} | {patient.phone}
      </p>
      <div className="ml-auto flex items-center gap-2 pt-[2px]">
        <p className="text-xs uppercase">VIEW</p>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
      </div>
    </Link>
  );
});

// export const SearchPatient = () => {
//   return (

//   )
// }
