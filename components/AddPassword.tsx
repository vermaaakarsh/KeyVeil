"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { CATEGORY_ENUM } from "@/lib/enums";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import FormField from "./FormField";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./ui/input";
import { encryptPassword } from "@/lib/password";

const addPasswordFormSchema = () => {
  return z
    .object({
      platformName: z.string().min(3),
      platformUsername: z.string(),
      platformUrl: z.string().url(),
      platformPassword: z.string(),
      category: z.string(),
    })
    .refine(
      (data) =>
        Object.values(CATEGORY_ENUM).includes(
          data.category as unknown as CATEGORY_ENUM
        ),
      {
        message: "Invalid category!",
        path: ["category"],
      }
    );
};

const AddPassword = ({ fetchPasswords }: { fetchPasswords: () => void }) => {
  const [open, setOpen] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORY_ENUM.personal
  );

  const formSchema = addPasswordFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      platformName: "",
      platformUsername: "",
      platformUrl: "",
      platformPassword: "",
      category: CATEGORY_ENUM.personal,
    },
  });

  const handleCategoryChange = (value: keyof typeof CATEGORY_ENUM) => {
    setSelectedCategory(CATEGORY_ENUM[value]);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file;
    if (event.target.files) {
      file = event.target.files[0];
    }
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      const text = (reader.result as string).trim();
      setMasterPassword(text);
    };

    reader.readAsText(file);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const encryptedPassword = await encryptPassword(
        values.platformPassword,
        masterPassword
      );
      console.log(encryptPassword);
      const passwordObject = {
        name: values.platformName,
        username: values.platformUsername,
        url: values.platformUrl,
        password: encryptedPassword,
        category: selectedCategory,
      };
      const response = await fetch("/api/password", {
        method: "POST",
        body: JSON.stringify(passwordObject),
      });
      const { status, message }: ICustomResponse = await response.json();
      if (status === "success") {
        toast.success(message);
        form.reset();
        setMasterPassword("");
        setOpen(false);
        fetchPasswords();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="flex justify-center lg:justify-end items-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">Add Password</Button>
        </DialogTrigger>
        <DialogContent className="mlr-15 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Add New Password</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="platformName"
                label="Platform Name"
                placeholder="Name of the platform"
              />
              <FormField
                control={form.control}
                name="platformUsername"
                label="Username"
                placeholder="Username"
              />
              <FormField
                control={form.control}
                name="platformUrl"
                label="URL"
                placeholder="URL of the platform"
              />
              <FormField
                control={form.control}
                name="platformPassword"
                label="Password"
                placeholder="Password of the platform"
                type="password"
                showPasswordToggle
              />
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select
                  onValueChange={handleCategoryChange}
                  value={
                    Object.keys(CATEGORY_ENUM).find(
                      (key) =>
                        CATEGORY_ENUM[key as keyof typeof CATEGORY_ENUM] ===
                        selectedCategory
                    ) ?? ""
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {(
                      Object.keys(CATEGORY_ENUM) as Array<
                        keyof typeof CATEGORY_ENUM
                      >
                    ).map((category) => {
                      return (
                        <SelectItem key={category} value={category}>
                          {CATEGORY_ENUM[category]}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                <div className="flex flex-col gap-1 mt-4 mb-2">
                  <Label htmlFor="masterPassword">Master Password</Label>
                  <div className="relative">
                    <Input
                      name="masterPassword"
                      placeholder="Enter your master password"
                      value={masterPassword}
                      type={showMasterPassword ? "text" : "password"}
                      required
                      autoComplete={"new-password"}
                      onChange={(e) => {
                        setMasterPassword(e.target.value);
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowMasterPassword((prev) => !prev)}
                    >
                      {showMasterPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                  <span className="flex justify-center items-center">OR</span>
                  <Input
                    name="masterPasswordFile"
                    placeholder="Upload the master password file"
                    type="file"
                    accept=".txt"
                    className="h-15 cursor-pointer"
                    onChange={onFileChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="default" type="submit">
                  Add
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPassword;
