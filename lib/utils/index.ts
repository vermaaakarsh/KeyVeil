import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkPasswordValidation = (): // password: string,
// name: string | undefined
boolean => {
  // TODO: Implement proper validation
  return true;
};
