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

const addPasswordFormSchema = () => {
  return z
    .object({
      name: z.string().min(3),
      username: z.string(),
      url: z.string().url(),
      password: z.string(),
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
  const [selectedCategory, setSelectedCategory] = useState(
    CATEGORY_ENUM.personal
  );

  const formSchema = addPasswordFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      username: "",
      url: "",
      password: "",
      category: CATEGORY_ENUM.personal,
    },
  });

  const handleCategoryChange = (value: keyof typeof CATEGORY_ENUM) => {
    setSelectedCategory(CATEGORY_ENUM[value]);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/password", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          category: selectedCategory,
        }),
      });
      const { status, message }: ICustomResponse = await response.json();
      if (status === "success") {
        toast.success(message);
        form.reset();
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
                name="name"
                label="Name"
                placeholder="Name of the platform"
              />
              <FormField
                control={form.control}
                name="username"
                label="Username"
                placeholder="Username"
              />
              <FormField
                control={form.control}
                name="url"
                label="URL"
                placeholder="URL of the platform"
              />
              <FormField
                control={form.control}
                name="password"
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
