'use client';

import React, { ReactNode, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FormControl, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import InfoComponent from './InfoComponent';

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'password';
  infoBox?: ReactNode;
  required?: boolean;
  showPasswordToggle?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  infoBox,
  required = false,
  showPasswordToggle = false,
  readOnly = false,
  autoComplete,
}: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center gap-1">
            <FormLabel>
              {label}
              {required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
            {infoBox && <InfoComponent>{infoBox}</InfoComponent>}
          </div>

          <FormControl>
            <div className="relative">
              <Input
                {...field}
                placeholder={placeholder}
                type={showPasswordToggle && showPassword ? 'text' : type}
                readOnly={readOnly}
                autoComplete={autoComplete}
                className={showPasswordToggle ? 'pr-10' : ''}
              />

              {showPasswordToggle && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  tabIndex={-1}
                  aria-label="Toggle password visibility"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
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

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormField;
