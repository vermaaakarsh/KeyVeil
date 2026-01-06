'use client';

import copy from 'copy-to-clipboard';
import { toast } from 'sonner';
import { Clipboard, Trash2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import ConfirmationBox from './ConfirmationBox';
import { decryptPassword } from '@/lib/password';
import { TEncryptedDataObject } from '@/services/cryptography/ICryptography';

const MASKED_PASSWORD = '••••••••••••••••';

interface PasswordItemProps {
  passwordData: {
    _id: string;
    name: string;
    username: string;
    url: string;
    password: TEncryptedDataObject;
    category: string;
    daysAgo: number;
    textColor: string;
  };
  vaultLocked: boolean;
  masterPassword: string;
  handlePasswordDelete: (passwordId: string) => void;
}

const PasswordItem = ({
  passwordData,
  vaultLocked,
  masterPassword,
  handlePasswordDelete,
}: PasswordItemProps) => {
  const handleRevealAndCopy = async () => {
    if (vaultLocked) return;

    const decrypted = await decryptPassword(
      passwordData.password,
      masterPassword,
    );

    copy(decrypted);
    toast.success('Password copied!');
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{passwordData.name}</CardTitle>

          {!vaultLocked && (
            <ConfirmationBox
              title="Delete password?"
              description="This cannot be undone."
              confirmationHandler={() => handlePasswordDelete(passwordData._id)}
            >
              <Trash2 className="cursor-pointer text-destructive" />
            </ConfirmationBox>
          )}
        </div>

        <CardDescription>{passwordData.url}</CardDescription>

        <div className="mt-2">
          <div>{passwordData.username}</div>
          <div className="flex gap-2 items-center">
            <span>{MASKED_PASSWORD}</span>
            {!vaultLocked && (
              <Clipboard
                className="cursor-pointer"
                onClick={handleRevealAndCopy}
              />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex justify-between text-sm">
        <span>{passwordData.category}</span>
        <span>
          Updated{' '}
          <span className={`${passwordData.textColor} font-bold`}>
            {passwordData.daysAgo} days
          </span>{' '}
          ago
        </span>
      </CardContent>
    </Card>
  );
};

export default PasswordItem;
