"use client";

import { Error, Result, unexpectedError } from "@/lib/results";
import { weekdays, AvailabilityData, availabilitySchema } from "@/lib/schemas/availabilitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import AlertMessage from "@/components/forms/AlertMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import { capitalize, cn, objectToFormData, setDateWithOriginalTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { endOfDay, format } from "date-fns";
import { TimePickerField } from "@/components/forms/TimePickerField";
import { Input } from "@/components/ui/input";
import { createAvailability } from "@/lib/actions/createAvailability";

import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

interface AvailabilityFormProps {
  title: string;
  description: string;
  doctorId: string;
  action: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}

export default function AvailabilityForm({
  title,
  description,
  doctorId,
  action,
}: AvailabilityFormProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [date, setDate] = useState<Date>(new Date());
  const [message, setMessage] = useState("");

  const form = useForm<AvailabilityData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      startTime: undefined,
      endTime: undefined,
      duration: "",
      recurring: false,
      mon: false,
      tue: false,
      wed: false,
      thu: false,
      fri: false,
      sat: false,
      sun: false,
      endDate: undefined,
    },
  });

  const recurring = form.watch("recurring");

  useEffect(() => {
    console.log("🚀 ~ recurring:", recurring);
  }, [recurring]);

  async function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
    setMessage("");
    try {
      const formData = objectToFormData(data);
      formData.append("doctorId", doctorId);
      const result = await createAvailability(formData);
      setMessage(result.message);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setMessage(unexpectedError().message);
    }
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
            onSubmit={form.handleSubmit(onSubmit, () => {
              console.log("errors", form.formState.errors);
              console.log("values", form.getValues());
            })}
            className="flex flex-col gap-3 md:gap-6"
          >
            <Popover open={isOpen} onOpenChange={setIsOpen}>
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
                  onSelect={(date) => {
                    if (date) {
                      form.setValue(
                        "startTime",
                        setDateWithOriginalTime(form.getValues("startTime"), date),
                      );
                      form.setValue(
                        "endTime",
                        setDateWithOriginalTime(form.getValues("endTime"), date),
                      );
                      setDate(date);
                      setIsOpen(false);
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
                  <FormItem className="w-[120px]">
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
                  <FormItem className="w-[120px]">
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
                  <FormItem className="w-[200px]">
                    <FormLabel>Duration</FormLabel>
                    <FormControl>
                      <div className="flex w-fit gap-2 rounded-md border">
                        <Input
                          name="duration"
                          type="text"
                          className="w-[64px] grow-0 border-none text-center font-mono text-base tabular-nums focus:bg-accent focus:text-accent-foreground [&::-webkit-inner-spin-button]:appearance-none"
                          value={field.value}
                          onChange={(e) => {
                            if (isNaN(Number(e.target.value))) return;
                            field.onChange(e);
                          }}
                          maxLength={3}
                        />
                        <div className="flex items-end py-2 pr-6 text-sm">minutes</div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-xs">Mind the available hours</FormDescription>
                    <FormMessage data-cy={`durationError`} />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Recurring?</FormLabel>
                    <FormDescription className="text-xs">
                      Repeat this slots at selected weekdays
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <fieldset className="rounded-lg border p-5" hidden={!form.watch("recurring")}>
              {/* <legend className="-ml-1 px-1 text-sm font-medium text-muted-foreground">User</legend> */}
              <div className="mb-9">
                <div className="mb-3 text-sm font-medium">Weekdays</div>
                <div className="flex gap-5">
                  {weekdays.map((weekday, index) => {
                    return (
                      <FormField
                        key={index}
                        control={form.control}
                        name={weekday as any}
                        render={({ field }) => (
                          <FormItem className="flex w-fit flex-col items-center">
                            <FormControl>
                              <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="cursor-pointer text-xs">
                              {capitalize(weekday)}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    );
                  })}
                </div>
              </div>
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="mb-1">End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => field.onChange(endOfDay(date!))}
                          disabled={(date) => date <= new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription className="text-xs">
                      The last day you want this pattern to repeat
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>

            <SubmitButton form={form} label="Submit" />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
