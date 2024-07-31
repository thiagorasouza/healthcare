"use client";

import { Error, Result } from "@/lib/results";
import { AvailabilityData, availabilitySchema } from "@/lib/schemas/availabilitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AlertMessage from "@/components/forms/AlertMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { TimePickerField } from "@/components/forms/TimePickerField";
import { Input } from "@/components/ui/input";
import { MinutesPickerInput } from "@/components/ui/mintes-picker-input";

interface AvailabilityFormProps {
  title: string;
  description: string;
  action: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}

export default function AvailabilityForm({ title, description, action }: AvailabilityFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [message, setMessage] = useState("");
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);

  const form = useForm<AvailabilityData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      startTime: undefined,
      endTime: undefined,
      duration: "",
    },
  });

  async function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
  }

  return (
    <Card className="max-w-[600px] shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <AlertMessage message={message} />
          <form
            onSubmit={form.handleSubmit(onSubmit, () => console.log(form.formState.errors))}
            className="flex flex-col gap-3 md:gap-6"
          >
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    if (date) {
                      form.setValue("startTime", date);
                      form.setValue("endTime", date);
                      setDate(date);
                    }
                  }}
                  required={true}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <TimePickerField date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormDescription className="text-xs">First available hour</FormDescription>
                    <FormMessage data-cy={`startTimeError`} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <TimePickerField date={field.value} setDate={field.onChange} />
                    </FormControl>
                    <FormDescription className="text-xs">Last available hour</FormDescription>
                    <FormMessage data-cy={`endTimeError`} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <div className="flex gap-2 rounded-md border">
                        <Input
                          name="duration"
                          type="text"
                          className="w-[64px] border-none text-center font-mono text-base tabular-nums focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                          value={field.value}
                          onChange={field.onChange}
                          pattern="\d*"
                          maxLength={3}
                        />
                        <div className="flex items-end py-2 pr-4 text-sm">minutes</div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">Minutes</FormDescription>
                    <FormMessage data-cy={`durationError`} />
                  </FormItem>
                )}
              />
            </div>
            <SubmitButton form={form} label="Submit" />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
