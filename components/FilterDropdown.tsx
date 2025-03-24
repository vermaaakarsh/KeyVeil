"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORY_ENUM } from "@/lib/enums";

const FilterDropdown = () => {
  const [selectedCategory, setSelectedCategory] =
    useState<CATEGORY_ENUM | null>();

  return (
    <div className="w-32">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="w-full" variant="outline" size="icon">
            <span className="p-1.5 block w-full truncate">
              {selectedCategory ?? "All"}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => setSelectedCategory(null)}>
            All
          </DropdownMenuItem>
          {(
            Object.keys(CATEGORY_ENUM) as Array<keyof typeof CATEGORY_ENUM>
          ).map((category) => {
            return (
              <DropdownMenuItem
                key={category}
                onSelect={() => setSelectedCategory(CATEGORY_ENUM[category])}
              >
                {CATEGORY_ENUM[category]}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FilterDropdown;
