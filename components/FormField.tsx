"use client";

import React, { ReactNode, useState } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import InfoComponent from "./InfoComponent";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  infoBox?: ReactNode;
  required?: boolean;
  showPasswordToggle?: boolean;
  disabled?: boolean;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  infoBox,
  required = true,
  showPasswordToggle = false,
  disabled = false,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>{label}</FormLabel>
            {infoBox && <InfoComponent>{infoBox}</InfoComponent>}
          </div>
          <FormControl>
            <div className="relative">
              <Input
                placeholder={placeholder}
                {...field}
                type={showPasswordToggle && showPassword ? "text" : type}
                required={required}
                className={showPasswordToggle ? "pr-10" : ""}
                autoComplete={
                  showPasswordToggle
                    ? "new-password"
                    : name === "username"
                    ? "off"
                    : "on"
                }
                disabled={disabled}
              />
              {showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              )}
            </div>
          </FormControl>
          <FormMessage>{fieldState.error?.message}</FormMessage>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
