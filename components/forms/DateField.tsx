import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface DateFieldProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  date?: Date;
  onDateSelect: (date?: Date) => void;
}

export default function DateField({ isOpen, date, onDateSelect, onOpenChange }: DateFieldProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <div>
          <div className="mb-3 text-sm font-medium">Available Date</div>
          <Button
            type="button"
            variant={"outline"}
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onDateSelect}
          required={true}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
