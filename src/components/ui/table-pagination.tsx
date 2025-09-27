"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TablePaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function TablePagination({
  page,
  totalPages,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="flex justify-center items-center mt-8 w-full">
      <div className="flex flex-row items-center justify-between gap-6 px-8 py-4 rounded-xl shadow bg-background border w-full max-w-2xl mx-auto">
        <Button
          size="sm"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
          aria-label="Pagina precedente"
          variant="outline"
          className="rounded-lg bg-muted hover:bg-primary/10 text-primary transition"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="text-base font-semibold text-primary text-center flex-1">
          Pagina {page + 1} di {totalPages}
        </span>
        <Button
          size="sm"
          disabled={page + 1 >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Pagina successiva"
          variant="outline"
          className="rounded-lg bg-muted hover:bg-primary/10 text-primary transition"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
