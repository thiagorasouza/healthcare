"use client";

import { Error, Result, unexpectedError } from "@/lib/results";
import { AvailabilityData, availabilitySchema } from "@/lib/schemas/availabilitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
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
import { cn, objectToFormData, setDateWithOriginalTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { TimePickerField } from "@/components/forms/TimePickerField";
import { Input } from "@/components/ui/input";
import { createAvailability } from "@/lib/actions/createAvailability";

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
    },
  });

  async function onSubmit(data: any) {
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
            onSubmit={form.handleSubmit(onSubmit, () => console.log(form.formState.errors))}
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
