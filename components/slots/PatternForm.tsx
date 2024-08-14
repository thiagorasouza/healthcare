"use client";

import { unexpectedError } from "@/lib/results";
import {
  PatternData,
  patternSchema,
  patternDefaultValues,
  parseDbData,
} from "@/lib/schemas/patternsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import AlertMessage from "@/components/forms/AlertMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import { objectToFormData, setDateWithOriginalTime } from "@/lib/utils";
import { endOfDay } from "date-fns";
import { WeekdaysField } from "@/components/forms/WeekdaysField";
import TimeField from "@/components/forms/TimeField";
import DurationField from "@/components/forms/DurationField";
import ToggleField from "@/components/forms/ToggleField";
import DateField from "@/components/forms/DateField";
import { PatternDocumentSchema } from "@/lib/schemas/appwriteSchema";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { CreatePatternResult } from "@/lib/actions/createPattern";
import { UpdatePatternResult } from "@/lib/actions/updatePattern";

interface PatternFormProps {
  doctorId: string;
  patternData?: PatternDocumentSchema;
  action: (form: FormData) => Promise<CreatePatternResult | UpdatePatternResult>;
  onSuccess: (patternData: PatternDocumentSchema) => void;
  submitLabel?: string;
}

export default function PatternForm({
  doctorId,
  patternData,
  action,
  onSuccess,
  submitLabel,
}: PatternFormProps) {
  const [message, setMessage] = useState("");

  const form = useForm<PatternData>({
    resolver: zodResolver(patternSchema),
    defaultValues: patternData ? parseDbData(patternData) : patternDefaultValues,
  });

  async function onSubmit(data: any) {
    // console.log("🚀 ~ data:", data);
    setMessage("");
    try {
      const formData = objectToFormData(data);

      formData.append("doctorId", doctorId);
      if (patternData) {
        formData.append("patternId", patternData.$id);
      }

      const result = await action(formData);
      if (result.success && result.data) {
        onSuccess(parseDbData(result.data));
        return;
      }

      setMessage(result.message);
    } catch (error) {
      // console.log("🚀 ~ error:", error);
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

  const recurring = form.watch("recurring");
  return (
    <Form {...form}>
      <AlertMessage message={message} />
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="flex flex-col gap-3 md:gap-6"
      >
        <DateField
          name="startDate"
          label="Start Date"
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
          labelOn="Recurring"
          descriptionOn="Toggle to make slots for a single date"
          labelOff="Single date"
          descriptionOff="Toggle to make a recurring pattern"
          form={form}
        />

        <DrawerAnimation toggle={recurring}>
          <fieldset className="rounded-lg border p-5">
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
        </DrawerAnimation>

        <SubmitButton form={form} label={submitLabel || "Submit"} className="mt-1 md:mt-2" />
      </form>
    </Form>
  );
}
