"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Pagination({
  currentPage,
  totalPages,
  pageChangeHandler,
}: Readonly<{
  currentPage: number;
  totalPages: number;
  pageChangeHandler: (newPage: number) => void;
}>) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 2;

    if (totalPages <= 6) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    pages.push(1);

    if (currentPage > maxVisiblePages + 2) {
      pages.push("...");
    }
    for (
      let i = Math.max(2, currentPage - maxVisiblePages);
      i <= Math.min(totalPages - 1, currentPage + maxVisiblePages);
      i++
    ) {
      pages.push(i);
    }
    if (currentPage < totalPages - maxVisiblePages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
    return pages;
  };

  return (
    <div className="flex items-center gap-2 justify-center mt-4">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage <= 1}
        onClick={() => pageChangeHandler(currentPage - 1)}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      {getPageNumbers().map((page, index) =>
        typeof page === "number" ? (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            className={cn("px-3", currentPage === page && "font-bold")}
            onClick={() => pageChangeHandler(page)}
          >
            {page}
          </Button>
        ) : (
          <span key={index + "page"} className="px-2 text-muted-foreground">
            {page}
          </span>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage >= totalPages}
        onClick={() => pageChangeHandler(currentPage + 1)}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
