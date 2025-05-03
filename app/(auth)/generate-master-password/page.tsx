"use client";

import React, { useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { exportPassword, generateRandomUniquePassword } from "@/lib/password";
import { Checkbox } from "@/components/ui/checkbox";

const masterPasswordFormSchema = () => {
  return z.object({
    masterPassword: z.string().min(16),
  });
};

const GenerateMasterPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refSubmitBtn = useRef<HTMLButtonElement>(null);
  const refExport = useRef<HTMLAnchorElement>(null);
  const formSchema = masterPasswordFormSchema();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      masterPassword: "",
    },
  });

  const generateRandomPassword = () => {
    const masterPassword = generateRandomUniquePassword();
    form.setValue("masterPassword", masterPassword);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    exportPassword(
      refExport,
      values.masterPassword,
      `KeyVeil_MasterPass_${searchParams.get("name")?.split(" ").join("_")}`
    );
    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        body: JSON.stringify({
          name: searchParams.get("name"),
          email: searchParams.get("email"),
          password: searchParams.get("password"),
        }),
      });
      const { status, message }: ICustomResponse = await response.json();
      if (status === "success") {
        toast.success(message);
        router.push("/sign-in");
        form.reset();
      } else {
        toast.error(message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  return (
    <div className="flex justify-center mt-16">
      <Card className="lg:w-[566px]">
        <CardHeader>
          <CardTitle className="flex justify-center">
            Generate <span className="text-primary ml-2 mr-2"> Master </span>{" "}
            Password
          </CardTitle>
          <CardDescription className="flex justify-center">
            This password will not be stored by us.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              autoComplete="off"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              <div className="flex flex-col gap-2">
                <div>
                  <FormField
                    control={form.control}
                    name="masterPassword"
                    label=""
                    type="password"
                    showPasswordToggle
                    disabled
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    generateRandomPassword();
                  }}
                >
                  Generate
                </Button>
                <a hidden={true} ref={refExport}>
                  Download
                </a>
              </div>
              <div className="items-top flex space-x-2">
                <Checkbox
                  id="terms1"
                  onCheckedChange={(checkedStatus: boolean) => {
                    if (refSubmitBtn.current) {
                      refSubmitBtn.current.disabled = !checkedStatus;
                    }
                  }}
                />
                <div className="grid gap-1.5 leading-none">
                  <label
                    htmlFor="terms1"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Confirm this as your master password
                  </label>
                  <p className="text-sm text-muted-foreground">
                    We do not store this password. Be sure to keep it secure.
                  </p>
                </div>
              </div>
              <Button
                ref={refSubmitBtn}
                className="w-full"
                type="submit"
                disabled
              >
                Confirm Master Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GenerateMasterPassword;
