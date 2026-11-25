"use client";

import * as React from "react";
import { vi } from "date-fns/locale/vi";
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

interface DatePickerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "value" | "onChange"
> {
  value?: Date | string;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  // The first and last day that can be picked.
  min?: Date;
  max?: Date;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      onChange,
      disabled,
      placeholder = "Pick a date",
      min,
      max,
      className,
      ...triggerProps
    },
    ref
  ) {
    const locale = useLocale();
    const [open, setOpen] = React.useState(false);
    const date = value ? new Date(value) : undefined;

    const handleDateChange = (newDate: Date | undefined) => {
      onChange(newDate);
      setOpen(false);
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
      <Popover open={open} onOpenChange={setOpen} modal>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal aria-[invalid=true]:border-error",
              !date && "text-muted-foreground",
              className
            )}
            disabled={disabled}
            {...triggerProps}
          >
            {formatDate(date)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            locale={locale === "vi" ? vi : undefined}
            defaultMonth={date ?? max ?? min}
            disabled={[
              ...(min ? [{ before: min }] : []),
              ...(max ? [{ after: max }] : []),
            ]}
            selected={date}
            onSelect={handleDateChange}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
