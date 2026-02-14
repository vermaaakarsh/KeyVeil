import { TEncryptedDataObject } from '@/services/cryptography/ICryptography';
import Cryptography from '../services/cryptography/Cryptography';

const cryptography = new Cryptography();

export function generateRandomUniquePassword(): string {
  return cryptography.getRandomBytes();
}

export const exportPassword = (
  masterPassword: string,
  filename: string,
): void => {
  const blob = new Blob([masterPassword], {
    type: 'text/plain;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.txt`;
  anchor.style.display = 'none';

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const encryptPassword = async (
  unencryptedPassword: string,
  masterPassword: string,
): Promise<TEncryptedDataObject> => {
  return await cryptography.encrypt(unencryptedPassword, masterPassword);
};

export const decryptPassword = async (
  encryptedData: TEncryptedDataObject,
  masterPassword: string,
): Promise<string> => {
  return await cryptography.decrypt(encryptedData, masterPassword);
};
