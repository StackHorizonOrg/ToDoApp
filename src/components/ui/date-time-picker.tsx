import {
  Calendar as CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
} from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface DateTimePickerSimpleProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DateTimePicker({
  date,
  setDate,
  className,
}: DateTimePickerSimpleProps) {
  const [open, setOpen] = React.useState(false);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setDate(undefined);
      setOpen(false);
      return;
    }
    const newDate = date ? new Date(date) : new Date();
    newDate.setFullYear(selectedDate.getFullYear());
    newDate.setMonth(selectedDate.getMonth());
    newDate.setDate(selectedDate.getDate());
    setDate(newDate);
    setOpen(false);
  };

  const handleTimeChange = (type: "hour" | "minute", value: number) => {
    if (!date) {
      return;
    }
    const newDate = new Date(date);
    if (type === "hour") {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }
    setDate(newDate);
  };

  return (
    <div>
      <div className="flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-col gap-1 flex-1">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                id="date-picker"
                className={cn(
                  "bg-background h-12 text-lg px-4 rounded-xl border border-primary/20 focus:border-primary/40 shadow-sm transition-colors w-full flex items-center gap-2 font-medium",
                  className,
                )}
                aria-label="Seleziona data"
              >
                <CalendarIcon className="w-5 h-5 text-primary" />
                <span className="truncate">
                  {date ? date.toLocaleDateString() : "Seleziona data"}
                </span>
                <ChevronDownIcon className="h-4 w-4 ml-auto" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "w-auto overflow-hidden p-0",
                "bg-white dark:bg-zinc-950",
              )}
              align="start"
            >
              <div className="flex flex-col sm:flex-row">
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout="dropdown"
                  onSelect={handleDateSelect}
                  className="bg-transparent"
                />
                <div className="flex flex-row gap-2 p-2">
                  <ScrollArea className="h-64 w-16">
                    <div className="flex flex-col">
                      {Array.from({ length: 24 }, (_, i) => i).map(hour => (
                        <Button
                          key={hour}
                          size="icon"
                          variant={
                            date && date.getHours() === hour
                              ? "default"
                              : "ghost"
                          }
                          className={cn(
                            "w-full aspect-square mb-1",
                            "bg-gray-50 text-gray-900 hover:bg-gray-100",
                            "dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                          )}
                          onClick={() => handleTimeChange("hour", hour)}
                        >
                          {hour.toString().padStart(2, "0")}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                  <ScrollArea className="h-64 w-16">
                    <div className="flex flex-col">
                      {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                        <Button
                          key={minute}
                          size="icon"
                          variant={
                            date && date.getMinutes() === minute
                              ? "default"
                              : "ghost"
                          }
                          className={cn(
                            "w-full aspect-square mb-1",
                            "bg-gray-50 text-gray-900 hover:bg-gray-100",
                            "dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                          )}
                          onClick={() => handleTimeChange("minute", minute)}
                        >
                          {minute.toString().padStart(2, "0")}
                        </Button>
                      ))}
                    </div>
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-1 w-32">
          <button
            type="button"
            className={cn(
              "bg-background h-12 text-lg px-4 rounded-xl border border-primary/20 focus:border-primary/40 shadow-sm transition-colors w-full flex items-center gap-2 font-medium cursor-pointer",
            )}
            onClick={() => setOpen(true)}
            aria-label="Seleziona orario"
          >
            <ClockIcon className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-gray-500 dark:text-zinc-400">
              {date
                ? `${date.getHours().toString().padStart(2, "0")}:${date
                    .getMinutes()
                    .toString()
                    .padStart(2, "0")}`
                : "--:--"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
