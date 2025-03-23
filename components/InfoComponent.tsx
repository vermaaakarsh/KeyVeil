"use client";
import { Info } from "lucide-react";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useState } from "react";

const InfoComponent = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [open, setOpen] = useState(false);
  return (
    <HoverCard open={open} onOpenChange={setOpen}>
      <HoverCardTrigger asChild onClick={() => setOpen(!open)}>
        <Info size={"20px"} />
      </HoverCardTrigger>
      <HoverCardContent className="lg:w-100" onClick={() => setOpen(false)}>
        {children}
      </HoverCardContent>
    </HoverCard>
  );
};

export default InfoComponent;
