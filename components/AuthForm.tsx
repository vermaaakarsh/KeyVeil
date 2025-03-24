"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";

const checkPasswordValidation = (): // password: string,
// name: string | undefined
boolean => {
  // TODO: Implement proper validation
  return true;
};

const authFormSchema = (type: TForm) => {
  return z
    .object({
      name: type === "sign-up" ? z.string().min(3) : z.string().optional(),
      email: z.string().email(),
      password: z
        .string()
        .min(12)
        .regex(
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]+/
        ),
      confirmPassword:
        type === "sign-up" ? z.string().min(12) : z.string().optional(),
    })
    .refine(
      () => {
        return checkPasswordValidation();
      },
      {
        message: "Password does not passes the checks. ",
        path: ["password"],
      }
    )
    .refine(
      (data) => !data.confirmPassword || data.confirmPassword === data.password,
      {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      }
    );
};

const AuthForm = ({ type }: { type: TForm }) => {
  const router = useRouter();
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "sign-up") {
        const response = await fetch("/api/sign-up", {
          method: "POST",
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          }),
        });
        const { status, message }: ICustomResponse = await response.json();
        if (status === "success") {
          toast.success(message);
          router.push("/sign-in");
        } else {
          toast.error(message);
        }
      } else {
        const response = await fetch("/api/sign-in", {
          method: "POST",
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });
        const { status, message }: ICustomResponse = await response.json();
        if (status === "success") {
          toast.success(message);
          router.push("/");
        } else {
          toast.error(message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  }

  const isSignIn = type === "sign-in";

  return (
    <div className="flex justify-center mt-16">
      <Card className="lg:w-[566px]">
        <CardHeader>
          <CardTitle className="flex justify-center">KeyVeil</CardTitle>
          <CardDescription className="flex justify-center">
            {isSignIn
              ? "Welcome back! Sign in to you account."
              : "Welcome! Create an account and manage your passwords seamlessly."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="name"
                  label="Name"
                  placeholder="Enter your name"
                />
              )}
              <FormField
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />
              <FormField
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                infoBox={
                  !isSignIn && (
                    <p>
                      Password should pass these checks:
                      <ul className="text-sm italic">
                        <li>At least 12+ characters</li>
                        <li>Contains uppercase characters (A-Z)</li>
                        <li>Contains lowercase characters (a-z)</li>
                        <li>Contains numbers (0-9)</li>
                        <li>Contains symbols (!,@,#,$,%,^,&,*,etc)</li>
                        <li>Is not a common password (abcde@123456)</li>
                      </ul>
                    </p>
                  )
                }
              />
              {!isSignIn && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  type="password"
                />
              )}
              <Button className="w-full" type="submit">
                {isSignIn ? "Sign In" : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col mt-2">
          <Separator className="my-2" />
          <div>
            <span className="text-muted-foreground text-sm mx-2">
              {isSignIn
                ? `Don't have an account yet?`
                : ` Already have an account?`}
            </span>
            <Link href={isSignIn ? "/sign-up" : "/sign-in"}>
              {isSignIn ? "Sign Up" : "Sign In"}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
