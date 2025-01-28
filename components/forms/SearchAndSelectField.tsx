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
import { Anchor } from "@radix-ui/react-popover";
import { ArrowUpRight, Search, UserIcon } from "lucide-react";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface HasId {
  id: string;
}

export interface SearchResult {
  value: string;
  label: string;
}

export interface SearchAndSelectFieldProps<Entity extends HasId> {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  defaultValue?: Entity;
  entities?: Entity[];
  parameter: keyof Entity;
  makeText: (entity: Entity) => string;
  makeLink: (entity: Entity) => string;
  onSelect?: (entity: Entity) => void;
  className?: string;
}

export function SearchAndSelectField<Entity extends HasId>({
  form,
  name,
  label,
  defaultValue,
  entities,
  parameter,
  makeText,
  makeLink,
  onSelect,
  className,
}: SearchAndSelectFieldProps<Entity>) {
  const [entity, setEntity] = useState<Entity | undefined>(defaultValue);

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={cn("flex-1", className)}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <>
              <SelectedEntity text={entity && makeText(entity)} link={entity && makeLink(entity)} />
              <SearchEntity
                form={form}
                name={name}
                entities={entities}
                parameter={parameter}
                makeText={makeText}
                onSelect={(entity) => {
                  setEntity(entity);
                  if (onSelect) onSelect(entity);
                }}
              />
            </>
          </FormControl>
          {/* <FormDescription className="text-xs">Search and select another {type}</FormDescription> */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Memoized
const SelectedEntity = memo(function SelectedEntity({
  link,
  text,
}: {
  link?: string;
  text?: string;
}) {
  return (
    <div className="border-1 flex w-full items-center gap-2 rounded-md border border-input bg-accent p-3 text-sm">
      <UserIcon className="h-4 w-4" />
      <p>{text || "Nothing selected."}</p>
      {link && (
        <Link
          href={link}
          target="_blank"
          className="group ml-auto flex cursor-pointer items-center gap-2 pt-[2px]"
        >
          <p className="hidden text-xs uppercase md:block">VIEW</p>
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
});

export interface SearchEntityProps<Entity extends HasId> {
  form: UseFormReturn<any>;
  name: string;
  parameter: keyof Entity;
  onSelect: (entity: Entity) => void;
  entities?: Entity[];
  makeText: (entity: Entity) => string;
}

export function SearchEntity<Entity extends HasId>({
  form,
  name,
  parameter,
  onSelect,
  entities,
  makeText,
}: SearchEntityProps<Entity>) {
  const [searchResults, setSearhResults] = useState<Entity[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const entitiesLoading = !entities;

  // === SEARCHING ENTITIES ==
  const searchEntities = useDebouncedCallback(
    (searchValue: string) => {
      if (!entities || searchValue.length === 0) {
        setSearhResults([]);
        return;
      }

      const result = entities.filter((entity) =>
        (entity[parameter] as string).toLowerCase().includes(searchValue.toLowerCase()),
      );

      setSearhResults(result);
    },
    [entities],
  );

  useEffect(() => {
    // Debounced
    searchEntities(searchValue);
  }, [searchValue, searchEntities]);

  // POPOVER OPENING LOGIC
  useEffect(() => {
    setOpen(searchValue.length > 0);
  }, [searchValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Anchor className="flex items-center rounded-md border border-input pl-3">
        <Search className="h-4 w-4" />
        <Input
          id="searchValue"
          name="searchValue"
          data-cy="searchValue"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder={entitiesLoading ? "Please wait..." : "Type to search"}
          readOnly={entitiesLoading || form.formState.isSubmitting}
          className="border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
          autoComplete="off"
        />
      </Anchor>
      <PopoverContent className="popover-content p-0" onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command>
          <CommandList>
            <CommandEmpty className="pb-2 pt-4">No results found.</CommandEmpty>
            <CommandGroup>
              {searchResults.map((entity) => (
                <CommandItem
                  key={entity.id}
                  className="cursor-pointer"
                  onSelect={() => {
                    setSearchValue("");
                    form.setValue(name, entity.id);
                    onSelect(entity);
                  }}
                >
                  {makeText(entity)}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
