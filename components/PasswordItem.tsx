"use client";

import React, { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const PasswordItem = ({
  passwordData,
}: {
  passwordData: {
    name: string;
    username: string;
    url: string;
    category: string;
    passwordLastUpdated: Date;
  };
}) => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [textColor, setTextColor] = useState("text-muted-foreground");
  const calculateDifference = () => {
    const timeDifference = Math.ceil(
      (new Date().getTime() -
        new Date(passwordData.passwordLastUpdated?.toString()).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    if (timeDifference > 180) {
      setTextColor("text-red-600");
    } else if (timeDifference < 180 && timeDifference > 120) {
      setTextColor("text-amber-300");
    }

    setDaysAgo(timeDifference > 0 ? timeDifference : 0);
  };

  useEffect(() => {
    calculateDifference();
  }, []);

  return (
    <Card className="w-[350px] overflow-auto cursor-pointer border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-primary dark:bg-input/30 dark:hover:bg-input/50">
      <CardHeader>
        <CardTitle>{passwordData.name}</CardTitle>
        <TooltipProvider>
          <CardDescription className="text-primary font-bold">
            {passwordData.username}
          </CardDescription>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="truncate">
                {passwordData.url}
              </CardDescription>
            </TooltipTrigger>
            <TooltipContent>{passwordData.url}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 md:flex-row lg:flex-row text-sm justify-between  mt-[-4]">
        <div className="text-muted-foreground">{passwordData.category}</div>
        <div>
          Updated{" "}
          <span className={`${textColor} font-bold`}>{daysAgo} days</span> ago.
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordItem;
