import React, { ReactNode } from "react";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import InfoComponent from "./InfoComponent";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  infoBox?: ReactNode;
  required?: boolean;
}

const FormField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  infoBox,
  required = true,
}: FormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          {infoBox ? (
            <div className="flex flex-row gap-1">
              <FormLabel className="label">{label}</FormLabel>
              <InfoComponent>{infoBox}</InfoComponent>
            </div>
          ) : (
            <FormLabel className="label">{label}</FormLabel>
          )}

          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              type={type}
              required={required}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
