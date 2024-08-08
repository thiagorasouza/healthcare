"use client";

import { Error, Result, unexpectedError } from "@/lib/results";
import { SlotData, slotSchema, slotDefaultValues } from "@/lib/schemas/slotsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import AlertMessage from "@/components/forms/AlertMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import { cn, objectToFormData, setDateWithOriginalTime } from "@/lib/utils";
import { endOfDay } from "date-fns";
import { WeekdaysField } from "@/components/forms/WeekdaysField";
import TimeField from "@/components/forms/TimeField";
import DurationField from "@/components/forms/DurationField";
import ToggleField from "@/components/forms/ToggleField";
import DateField from "@/components/forms/DateField";

interface SlotsFormProps {
  title: string;
  description: string;
  doctorId: string;
  className?: string;
  action: (form: FormData) => Promise<Result<unknown> | Error<unknown>>;
}

export default function SlotsForm({
  title,
  description,
  doctorId,
  action,
  className,
}: SlotsFormProps) {
  const [message, setMessage] = useState("");

  const form = useForm<SlotData>({
    resolver: zodResolver(slotSchema),
    defaultValues: slotDefaultValues,
  });

  async function onSubmit(data: any) {
    console.log("🚀 ~ data:", data);
    setMessage("");
    try {
      const formData = objectToFormData(data);
      formData.append("doctorId", doctorId);
      const result = await action(formData);
      setMessage(result.message);
    } catch (error) {
      console.log("🚀 ~ error:", error);
      setMessage(unexpectedError().message);
    }
  }

  function onError() {
    console.error("onError");
    console.log("errors", form.formState.errors);
    console.log("values", form.getValues());
  }

  function onStartDate(date?: Date) {
    if (date) {
      form.setValue("startTime", setDateWithOriginalTime(form.getValues("startTime"), date));
      form.setValue("endTime", setDateWithOriginalTime(form.getValues("endTime"), date));
    }
    return date;
  }

  return (
    <Card className={cn("shadow", className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <AlertMessage message={message} />
          <form
            onSubmit={form.handleSubmit(onSubmit, onError)}
            className="flex flex-col gap-3 md:gap-6"
          >
            <DateField
              name="startDate"
              label="Available Date"
              placeholder="Pick a date"
              form={form}
              onSelect={onStartDate}
              disabled={(date) => date <= new Date()}
            />
            <div className="flex flex-col gap-3 md:flex-row md:gap-6">
              <TimeField
                name="startTime"
                label="Start time"
                description="First available hour"
                form={form}
              />
              <TimeField
                name="endTime"
                label="End Time"
                description="Last available hour"
                form={form}
              />
              <DurationField
                name="duration"
                label="Duration"
                description="Mind the available hours"
                form={form}
              />
            </div>
            <ToggleField
              name="recurring"
              label="Recurring?"
              description="Repeat this slots at selected weekdays"
              form={form}
            />
            <fieldset className="rounded-lg border p-5" hidden={!form.watch("recurring")}>
              <WeekdaysField form={form} />
              <DateField
                name="endDate"
                label="End Date"
                placeholder="Pick a date"
                form={form}
                onSelect={(date) => (date ? endOfDay(date) : date)}
                disabled={(date) => date <= form.getValues("startDate")}
                description="The last day you want this pattern to repeat"
              />
            </fieldset>
            <SubmitButton form={form} label="Submit" />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
