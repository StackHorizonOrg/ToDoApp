"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";
import { it } from "react-day-picker/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  id?: string;
  disabled?: boolean; // aggiunto supporto per la prop disabled
}

export function DatePicker({
  value,
  onChange,
  id = "date",
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className="justify-between font-normal w-full"
            disabled={disabled} // disabilita il bottone se serve
          >
            {value ? value.toLocaleDateString() : "Seleziona data"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value}
            captionLayout="dropdown"
            onSelect={date => {
              onChange?.(date);
              setOpen(false);
            }}
            locale={it}
            disabled={disabled} // disabilita la selezione se serve
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
