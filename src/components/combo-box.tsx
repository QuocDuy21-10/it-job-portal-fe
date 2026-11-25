"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeSearchText } from "@/lib/utils/search-text";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ComboboxProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "value" | "onChange"
> {
  options: { label: string; value: string }[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  // Set it when the options come from a server search: local filtering is turned off.
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
  loadingText?: string;
}

export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select an option",
      searchPlaceholder = "Search...",
      emptyText = "No results found.",
      onSearchChange,
      isLoading,
      loadingText = "Loading...",
      className,
      ...triggerProps
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const selectedLabel = options.find(
      (option) => option.value === value
    )?.label;
    // cmdk loses its highlight when a server search replaces the options, so Enter would do nothing.
    const [highlighted, setHighlighted] = React.useState("");
    const active = options.some((option) => option.value === highlighted)
      ? highlighted
      : (options[0]?.value ?? "");

    return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) onSearchChange?.("");
        }}
        modal
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between font-normal aria-[invalid=true]:border-error",
              !selectedLabel && "text-muted-foreground",
              className
            )}
            {...triggerProps}
          >
            <span className="truncate">{selectedLabel ?? placeholder}</span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
          {/* Match the label only: ids are hex and would match short searches. */}
          <Command
            shouldFilter={!onSearchChange}
            {...(onSearchChange && {
              value: active,
              onValueChange: setHighlighted,
            })}
            filter={(_value, search, keywords) =>
              normalizeSearchText(keywords?.[0] ?? "").includes(
                normalizeSearchText(search)
              )
                ? 1
                : 0
            }
          >
            <CommandInput
              placeholder={searchPlaceholder}
              onValueChange={onSearchChange}
            />
            <CommandList>
              <CommandEmpty>{isLoading ? loadingText : emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => {
                      onChange(option.value);
                      onSearchChange?.("");
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);
Combobox.displayName = "Combobox";
