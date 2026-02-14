'use client';

import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import FormField from '@/components/FormField';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { exportPassword, generateRandomUniquePassword } from '@/lib/password';
import { Checkbox } from '@/components/ui/checkbox';

/* =========================
   Schema (defined once)
========================= */
const masterPasswordFormSchema = z.object({
  masterPassword: z
    .string()
    .min(16, 'Master password must be at least 16 characters'),
});

type MasterPasswordFormValues = z.infer<typeof masterPasswordFormSchema>;

const GenerateMasterPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmed, setConfirmed] = useState(false);
  const [passwordGenerated, setPasswordGenerated] = useState(false);

  const form = useForm<MasterPasswordFormValues>({
    resolver: zodResolver(masterPasswordFormSchema),
    defaultValues: {
      masterPassword: '',
    },
  });

  /* =========================
     Generate password
  ========================= */
  const generateRandomPassword = () => {
    const masterPassword = generateRandomUniquePassword();
    form.setValue('masterPassword', masterPassword, {
      shouldValidate: true,
    });
    setPasswordGenerated(true);
    setConfirmed(false);
  };

  /* =========================
     Submit handler
  ========================= */
  async function onSubmit(values: MasterPasswordFormValues) {
    if (!passwordGenerated) {
      toast.error('Please generate a master password first.');
      return;
    }

    try {
      const response = await fetch('/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchParams.get('name'),
          email: searchParams.get('email'),
          password: searchParams.get('password'),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Signup failed');
        return;
      }

      exportPassword(values.masterPassword, 'KeyVeil_Master_Password');

      toast.success('Account created successfully');
      form.reset();
      router.push('/sign-in');
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong!');
    }
  }

  return (
    <div className="flex justify-center mt-16">
      <Card className="lg:w-[566px]">
        <CardHeader>
          <CardTitle className="flex justify-center">
            Generate <span className="text-primary mx-2">Master</span> Password
          </CardTitle>
          <CardDescription className="flex justify-center">
            This password is never stored. Save it securely.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              autoComplete="off"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            >
              {/* Password Field */}
              <div className="flex flex-col gap-2">
                <FormField
                  control={form.control}
                  name="masterPassword"
                  type="password"
                  label=""
                  readOnly
                  showPasswordToggle
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={generateRandomPassword}
                >
                  Generate
                </Button>
              </div>

              {/* Confirmation */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="confirm"
                  disabled={!passwordGenerated}
                  checked={confirmed}
                  onCheckedChange={(checked) => setConfirmed(Boolean(checked))}
                />
                <div className="grid gap-1.5 leading-none">
                  <label htmlFor="confirm" className="text-sm font-medium">
                    Confirm this as your master password
                  </label>
                  <p className="text-sm text-muted-foreground">
                    We cannot recover this password if lost.
                  </p>
                </div>
              </div>

              {/* Submit */}
              <Button className="w-full" type="submit" disabled={!confirmed}>
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
