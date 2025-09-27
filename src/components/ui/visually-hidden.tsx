import type * as React from "react";

// Componente di utilità per contenuti solo per screen reader.
// Usa classi standard "sr-only" garantendo accessibilità e mantenendo la possibilità di wrappare qualsiasi children.
export function VisuallyHidden({
  as: Comp = "span",
  className,
  children,
  ...props
}: {
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<"span">) {
  return (
    <Comp
      className={["sr-only", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </Comp>
  );
}
