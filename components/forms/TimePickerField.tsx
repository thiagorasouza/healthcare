"use client";

import * as React from "react";
import { TimePickerInput } from "@/components/ui/time-picker-input";

interface TimePickerDemoProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function TimePickerField({ date, setDate }: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-1 rounded-md border">
      <TimePickerInput
        picker="hours"
        date={date}
        setDate={setDate}
        ref={hourRef}
        className="border-none caret-current"
        onRightFocus={() => minuteRef.current?.focus()}
      />
      :
      <TimePickerInput
        picker="minutes"
        date={date}
        setDate={setDate}
        ref={minuteRef}
        className="border-none caret-current"
        onLeftFocus={() => hourRef.current?.focus()}
      />
    </div>
  );
}
