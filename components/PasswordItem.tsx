"use client";

import React, { useEffect, useState } from "react";
import copy from "copy-to-clipboard";
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
import { TEncryptedDataObject } from "@/services/cryptography/ICryptography";
import { decryptPassword } from "@/lib/password";
import { Clipboard, Trash2 } from "lucide-react";
import ConfirmationBox from "./ConfirmationBox";
import { toast } from "sonner";

const PasswordItem = ({
  passwordData,
  vaultLocked,
  masterPassword,
  handlePasswordDelete,
}: {
  passwordData: {
    _id: string;
    name: string;
    username: string;
    url: string;
    password: TEncryptedDataObject;
    category: string;
    passwordLastUpdated: Date;
  };
  vaultLocked: boolean;
  masterPassword: string;
  handlePasswordDelete: (passwordId: string) => void;
}) => {
  const [daysAgo, setDaysAgo] = useState(0);
  const [textColor, setTextColor] = useState("text-muted-foreground");
  const [passwordDisplay, setPasswordDisplay] = useState("*****************");
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

  const handleCopyToClipboard = () => {
    copy(passwordDisplay);
    toast.success("Password copied to Clipboard!");
  };

  const handlePasswordDisplay = async () => {
    if (vaultLocked) {
      setPasswordDisplay("*****************");
    } else {
      const temp = await decryptPassword(passwordData.password, masterPassword);
      setPasswordDisplay(temp);
    }
  };

  useEffect(() => {
    handlePasswordDisplay();
  }, [vaultLocked]);

  useEffect(() => {
    calculateDifference();
  }, []);

  return (
    <Card className="w-[350px] overflow-auto border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:border-primary dark:bg-input/30 dark:hover:bg-input/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{passwordData.name}</CardTitle>
          {!vaultLocked && (
            <ConfirmationBox
              title="Are you sure you want to delete this password?"
              description={"This can not be undone!"}
              confirmationHandler={() => {
                handlePasswordDelete(passwordData._id);
              }}
            >
              <Trash2 className="text-destructive cursor-pointer" />
            </ConfirmationBox>
          )}
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="truncate">
                {passwordData.url}
              </CardDescription>
            </TooltipTrigger>
            <TooltipContent>{passwordData.url}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <CardDescription className="text-primary font-bold mt-4">
          {passwordData.username}
          <div className="flex gap-0.5">
            {passwordDisplay}
            {!vaultLocked && (
              <Clipboard
                className="text-foreground cursor-pointer size-4"
                onClick={handleCopyToClipboard}
              />
            )}
          </div>
        </CardDescription>
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
