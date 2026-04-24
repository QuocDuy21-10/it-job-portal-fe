"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { formatLocaleDate } from "@/lib/utils/locale-formatters";

interface DatePickerProps {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = "Pick a date",
}: DatePickerProps) {
  const locale = useLocale();
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!value) return undefined;
    if (value instanceof Date) return value;
    return new Date(value);
  });

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
    onChange(newDate);
  };

  const formatDate = (d: Date | undefined) => {
    if (!d) return placeholder;
    return formatLocaleDate(d, locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {formatDate(date)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
