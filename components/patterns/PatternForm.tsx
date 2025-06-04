import DateField from "@/components/forms/DateField";
import DurationField from "@/components/forms/DurationField";
import ErrorMessage from "@/components/forms/ErrorMessage";
import SubmitButton from "@/components/forms/SubmitButton";
import TimeField from "@/components/forms/TimeField";
import ToggleField from "@/components/forms/ToggleField";
import { WeekdaysField } from "@/components/forms/WeekdaysField";
import DrawerAnimation from "@/components/shared/DrawerAnimation";
import { Form } from "@/components/ui/form";
import { objectToFormData } from "@/lib/utils";
import { createPattern } from "@/server/actions/createPattern";
import { updatePattern } from "@/server/actions/updatePattern";
import {
  patternDefaultValues,
  PatternFormData,
  patternFormSchema,
} from "@/server/adapters/zod/patternValidator";
import { displayError } from "@/server/config/errors";
import { PatternModel } from "@/server/domain/models/patternModel";
import { setDateKeepTime } from "@/server/useCases/shared/helpers/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { isBefore } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface CreatePatternFormProps {
  mode: "create";
  doctorId: string;
  pattern?: undefined;
  onSaved?: (pattern: PatternModel) => void;
}

export interface UpdatePatternFormProps {
  mode: "update";
  doctorId?: undefined;
  pattern: PatternModel;
  onSaved?: (pattern: PatternModel) => void;
}

export function PatternForm({
  pattern,
  mode,
  onSaved,
  doctorId,
}: CreatePatternFormProps | UpdatePatternFormProps) {
  // console.log("🚀 ~ pattern:", pattern);

  const [message, setMessage] = useState("");
  const form = useForm<PatternFormData>({
    resolver: zodResolver(patternFormSchema),
    defaultValues: pattern || { ...patternDefaultValues, doctorId },
  });

  const recurring = form.watch("recurring");
  const startDate = form.watch("startDate");

  // endDate update logic
  useEffect(() => {
    const endDate = form.getValues("endDate");
    // sets endDate to match startDate if pattern is not recurring
    if (!recurring && !endDate && startDate) {
      form.setValue("endDate", startDate);
    }

    // sets endDate to match startDate if it is before
    if (endDate && isBefore(endDate, startDate)) {
      form.setValue("endDate", startDate);
    }
  }, [startDate, form, recurring]);

  // updates the date part of startTime and endTime to match startDate
  function onStartDate(startDate?: Date) {
    if (startDate) {
      form.setValue("startTime", setDateKeepTime(form.getValues("startTime"), startDate));
      form.setValue("endTime", setDateKeepTime(form.getValues("endTime"), startDate));
    }
  }

  async function onSubmit(data: PatternFormData) {
    setMessage("");
    const formData = objectToFormData(data);
    try {
      if (mode === "update") {
        formData.append("id", pattern.id);

        const updateResult = await updatePattern(formData);
        if (!updateResult.ok) {
          setMessage(displayError(updateResult));
          return;
        }

        toast("Pattern updated.");
        if (onSaved) onSaved(updateResult.value);
      } else if (mode === "create") {
        const createResult = await createPattern(formData);

        if (!createResult.ok) {
          setMessage(displayError(createResult));
          return;
        }

        toast("Pattern created.");
        if (onSaved) onSaved(createResult.value);
      }
    } catch (error) {
      setMessage(displayError());
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <ErrorMessage message={message} />
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3 md:gap-6">
        <DateField
          form={form}
          name="startDate"
          label="Start Date"
          placeholder="Pick a date"
          disabledFn={(date) => date <= new Date()}
          onSelect={onStartDate}
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
              disabledFn={(date) => date <= form.getValues("startDate")}
              description="The last day you want this pattern to repeat"
            />
          </fieldset>
        </DrawerAnimation>

        <SubmitButton form={form} label="Save" />
      </form>
    </Form>
  );
}
