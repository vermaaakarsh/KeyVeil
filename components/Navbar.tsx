"use client";

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
import { TUser } from "@/types/TUser";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormField from "./FormField";
import Image from "next/image";
import useLogo from "./customHooks/useLogo";

const isCorrectPassword = async (password: string): Promise<boolean> => {
  try {
    const response = await fetch("/api/user/password/check", {
      method: "POST",
      body: JSON.stringify({
        password,
      }),
    });
    const { status, message, data }: ICustomResponse = await response.json();
    if (status === "success") {
      return data.isCorrectPassword;
    } else {
      toast.error(message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went wrong!");
  }
  return false;
};

const updateUserPasswordFormSchema = () => {
  return z
    .object({
      oldPassword: z.string(),
      newPassword: z
        .string()
        .min(12)
        .regex(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+/
        ),
    })
    .superRefine(async (data, ctx) => {
      const isValid = await isCorrectPassword(data.oldPassword);
      if (!isValid) {
        ctx.addIssue({
          path: ["oldPassword"],
          code: z.ZodIssueCode.custom,
          message: "Password is incorrect!",
        });
      }

      if (data.oldPassword === data.newPassword) {
        ctx.addIssue({
          path: ["newPassword"],
          code: z.ZodIssueCode.custom,
          message: "New password must be different from old password!",
        });
      }
    });
};

const Navbar = ({ user }: { user: TUser }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { setTheme } = useTheme();
  const { keyVeilLogo } = useLogo();

  const formSchema = updateUserPasswordFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
  });

  const onPasswordUpdateSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/user/password", {
        method: "PUT",
        body: JSON.stringify({ password: values.newPassword }),
      });
      const { status, message }: ICustomResponse = await response.json();
      if (status === "success") {
        form.reset();
        toast.success(message);
        setOpen(false);
        router.push("/sign-in");
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

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
      <span className="lg:px-4 md:px-4 px-1  pt-1">
        <Image src={keyVeilLogo} alt="KeyVeil" width={180} />
      </span>
      <div className="flex gap-1.5 justify-center items-center">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarFallback>
                {user.name.split(" ")[0][0] +
                  user.name.split(" ").slice(-1)[0][0]}
              </AvatarFallback>
            </Avatar>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Profile</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 p-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={user.name}
                  className="col-span-3"
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Email
                </Label>
                <Input
                  id="username"
                  value={user.email}
                  className="col-span-3"
                  disabled
                />
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onPasswordUpdateSubmit)}
                  className="grid gap-4"
                >
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    label="Old Password"
                    placeholder="Enter your old password"
                    type="password"
                    showPasswordToggle
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter a new password"
                    type="password"
                    showPasswordToggle
                  />
                  <Button type="submit">Update Password</Button>
                </form>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
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
