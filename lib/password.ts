import { TEncryptedDataObject } from "@/services/cryptography/ICryptography";
import Cryptography from "../services/cryptography/Cryptography";

const cryptography = new Cryptography();

export function generateRandomUniquePassword(): string {
  return cryptography.getRandomBytes();
}

export const exportPassword = (
  elementReference: React.RefObject<HTMLAnchorElement | null>,
  masterPassword: string,
  filename: string
): void => {
  const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
    masterPassword
  )}`;
  if (elementReference.current) {
    elementReference.current.href = jsonString;
    elementReference.current.download = `${filename}.txt`;
    elementReference.current.click();
  }
};

export const encryptPassword = async (
  unencryptedPassword: string,
  masterPassword: string
): Promise<TEncryptedDataObject> => {
  return await cryptography.encrypt(unencryptedPassword, masterPassword);
};

export const decryptPassword = async (
  encryptedData: TEncryptedDataObject,
  masterPassword: string
): Promise<string> => {
  return await cryptography.decrypt(encryptedData, masterPassword);
};
