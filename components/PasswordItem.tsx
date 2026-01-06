'use client';

import { useMemo, useState } from 'react';
import copy from 'copy-to-clipboard';
import { Clipboard, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import ConfirmationBox from './ConfirmationBox';
import { decryptPassword } from '@/lib/password';
import { TPassword } from '@/types/TPassword';

const MASKED_PASSWORD = '••••••••••••••••';

interface PasswordItemProps {
  passwordData: TPassword;
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
  /** Store ONLY decrypted password */
  const [decryptedPassword, setDecryptedPassword] = useState<string | null>(
    null,
  );

  /* =========================
     Normalize date (safe)
  ========================= */
  const lastUpdated = useMemo(() => {
    return passwordData.passwordLastUpdated instanceof Date
      ? passwordData.passwordLastUpdated
      : new Date(passwordData.passwordLastUpdated);
  }, [passwordData.passwordLastUpdated]);

  /* =========================
     Derived UI state (PURE)
  ========================= */
  const { daysAgo, textColor } = useMemo(() => {
    const now = Date.parse(new Date().toISOString());
    const diffMs = now - lastUpdated.getTime();

    const diffDays = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);

    let color = 'text-muted-foreground';
    if (diffDays > 180) color = 'text-red-600';
    else if (diffDays > 120) color = 'text-amber-400';

    return { daysAgo: diffDays, textColor: color };
  }, [lastUpdated]);

  /* =========================
     Derived display (NO STATE)
  ========================= */
  const passwordDisplay =
    vaultLocked || !decryptedPassword ? MASKED_PASSWORD : decryptedPassword;

  /* =========================
     Handlers
  ========================= */
  const handleReveal = async () => {
    if (vaultLocked || decryptedPassword) return;

    try {
      const decrypted = await decryptPassword(
        passwordData.password,
        masterPassword,
      );
      setDecryptedPassword(decrypted);
    } catch {
      toast.error('Failed to decrypt password');
    }
  };

  const handleHide = () => {
    setDecryptedPassword(null);
  };

  const handleCopy = () => {
    if (passwordDisplay === MASKED_PASSWORD) return;
    copy(passwordDisplay);
    toast.success('Password copied to clipboard');
  };

  /* =========================
     Render
  ========================= */
  return (
    <Card
      className="w-[350px] border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground"
      onMouseEnter={handleReveal}
      onMouseLeave={handleHide}
    >
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{passwordData.name}</CardTitle>

          {!vaultLocked && (
            <ConfirmationBox
              title="Delete password?"
              description="This action cannot be undone."
              confirmationHandler={() => handlePasswordDelete(passwordData._id)}
            >
              <Trash2 className="cursor-pointer text-destructive" />
            </ConfirmationBox>
          )}
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CardDescription className="truncate">
                {passwordData.url}
              </CardDescription>
            </TooltipTrigger>
            <TooltipContent>{passwordData.url}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <CardDescription className="mt-4">
          <div className="font-semibold text-primary">
            {passwordData.username}
          </div>

          <div className="flex items-center gap-1 mt-1">
            {passwordDisplay}
            {!vaultLocked && passwordDisplay !== MASKED_PASSWORD && (
              <Clipboard
                className="h-4 w-4 cursor-pointer"
                onClick={handleCopy}
              />
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex justify-between text-sm">
        <span className="text-muted-foreground">{passwordData.category}</span>
        <span>
          Updated{' '}
          <span className={`${textColor} font-semibold`}>{daysAgo} days</span>{' '}
          ago
        </span>
      </CardContent>
    </Card>
  );
};

export default PasswordItem;
