import { ChevronDownIcon, Clock8Icon } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type TimePickerProps = {
  value?: string; // formato "HH:mm"
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function TimePicker({
  value,
  onChange,
  label = "Orario",
  disabled,
  className,
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [hour, setHour] = React.useState<number | undefined>(undefined);
  const [minute, setMinute] = React.useState<number | undefined>(undefined);

  // Aggiorna lo stato locale solo quando value cambia
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHour(Number.parseInt(h, 10));
      setMinute(Number.parseInt(m, 10));
    } else {
      setHour(undefined);
      setMinute(undefined);
    }
  }, [value]);

  const handleHourSelect = (h: number) => {
    setHour(h);
    if (minute !== undefined) {
      onChange?.(
        `${h.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`,
      );
    }
  };

  const handleMinuteSelect = (m: number) => {
    setMinute(m);
    if (hour !== undefined) {
      onChange?.(
        `${hour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      );
    }
  };

  return (
    <div className={cn("w-full max-w-xs space-y-2", className)}>
      <Label htmlFor="time-picker">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="time-picker"
            disabled={disabled}
            className={cn(
              "bg-background h-12 text-lg px-4 rounded-xl border border-primary/20 focus:border-primary/40 shadow-sm transition-colors w-full flex items-center gap-2 font-medium",
              disabled && "opacity-50 cursor-not-allowed",
            )}
            aria-label="Seleziona orario"
          >
            <Clock8Icon className="w-5 h-5 text-primary" />
            <span className="text-base font-semibold text-gray-500 dark:text-zinc-400">
              {hour !== undefined && minute !== undefined
                ? `${hour.toString().padStart(2, "0")}:${minute
                    .toString()
                    .padStart(2, "0")}`
                : "--:--"}
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
          <div className="flex flex-row gap-2 p-2">
            <ScrollArea className="h-64 w-16">
              <div className="flex flex-col">
                {Array.from({ length: 24 }, (_, i) => i).map(h => (
                  <Button
                    key={h}
                    size="icon"
                    variant={hour === h ? "default" : "ghost"}
                    className={cn(
                      "w-full aspect-square mb-1",
                      "bg-gray-50 text-gray-900 hover:bg-gray-100",
                      "dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                    )}
                    onClick={() => handleHourSelect(h)}
                  >
                    {h.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
            <ScrollArea className="h-64 w-16">
              <div className="flex flex-col">
                {Array.from({ length: 60 }, (_, i) => i).map(m => (
                  <Button
                    key={m}
                    size="icon"
                    variant={minute === m ? "default" : "ghost"}
                    className={cn(
                      "w-full aspect-square mb-1",
                      "bg-gray-50 text-gray-900 hover:bg-gray-100",
                      "dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800",
                    )}
                    onClick={() => handleMinuteSelect(m)}
                  >
                    {m.toString().padStart(2, "0")}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default TimePicker;
