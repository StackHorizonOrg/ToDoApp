import type * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/40 border-2 border-input/60 flex h-12 w-full min-w-0 rounded-2xl bg-background px-5 py-2 text-base shadow-md transition-all outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-base file:font-semibold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/30",
        "aria-invalid:ring-destructive/30 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
