import { ChevronDown, ChevronUp } from "lucide-react";
import type React from "react";
import { type JSX, useRef, useState } from "react";

export type Contact = {
  type: string;
  value: string;
  icon: JSX.Element;
};

type Props = {
  contacts: Contact[];
};

export function ContactCell({ contacts }: Props) {
  const [index, setIndex] = useState(0);
  const touchStartY = useRef<number | null>(null);

  if (contacts.length === 0) {
    return <span className="text-gray-400 text-xs">Nessun contatto</span>;
  }

  const handlePrev = () =>
    setIndex(i => (i === 0 ? contacts.length - 1 : i - 1));
  const handleNext = () =>
    setIndex(i => (i === contacts.length - 1 ? 0 : i + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) {
      return;
    }
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(deltaY) > 30) {
      if (deltaY > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }
    touchStartY.current = null;
  };

  const contact = contacts[index];

  return (
    <div
      className="flex items-center justify-between gap-2 min-h-8 w-56"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ minWidth: "14rem", maxWidth: "14rem" }}
    >
      <div className="flex items-center gap-2 flex-1 overflow-hidden">
        {contact?.icon}
        <span
          className="text-xs truncate"
          style={{ minWidth: "0", width: "10rem", display: "inline-block" }}
        >
          {contact?.value}
        </span>
      </div>
      <div className="flex flex-col items-center gap-1 min-h-[40px] justify-center">
        <button
          type="button"
          className="p-0.5 hover:bg-gray-200 rounded"
          onClick={handlePrev}
          aria-label="Precedente"
        >
          <ChevronUp className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="p-0.5 hover:bg-gray-200 rounded"
          onClick={handleNext}
          aria-label="Successivo"
        >
          <ChevronDown className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
