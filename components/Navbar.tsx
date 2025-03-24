"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmationBox from "./ConfirmationBox";

const Navbar = () => {
  const router = useRouter();
  const { setTheme } = useTheme();

  const logoutHandler = async () => {
    const response = await fetch("/api/user/logout", {
      method: "GET",
    });
    const { status, message }: ICustomResponse = await response.json();
    if (status === "success") {
      toast.success(message);
      router.push("/sign-in");
    } else {
      toast.error(message);
    }
  };

  return (
    <nav className="flex justify-between items-center px-4 h-16 bg-background text-foreground">
      <span className="font-bold text-xl">KeyVeil</span>
      <div className="flex gap-2 justify-center items-center">
        <Avatar>
          <AvatarFallback>AV</AvatarFallback>
        </Avatar>
        <ConfirmationBox
          title="Are you sure you want to log out?"
          description={"Any unsaved changes will be lost."}
          confirmationHandler={logoutHandler}
        >
          <Button variant={"outline"}>Logout</Button>
        </ConfirmationBox>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
