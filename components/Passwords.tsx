'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import PasswordItem from './PasswordItem';
import Pagination from './Pagination';
import SearchBar from './SearchBar';
import FilterDropdown from './FilterDropdown';
import AddPassword from './AddPassword';
import ConfirmationBox from './ConfirmationBox';

import { TPassword } from '@/types/TPassword';
import { CATEGORY_ENUM } from '@/lib/enums';

import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';

/* =========================
   Types
========================= */
interface PasswordsProps {
  initialPasswords: TPassword[];
  initialTotalPages: number;
}

type PasswordsResponse = {
  status: 'success' | 'error';
  message: string;
  data: {
    passwords: TPassword[];
    totalPages: number;
  } | null;
};

/* =========================
   Component
========================= */
const Passwords = ({ initialPasswords, initialTotalPages }: PasswordsProps) => {
  const [passwords, setPasswords] = useState<TPassword[]>(initialPasswords);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);

  const [currentPage, setCurrentPage] = useState(1);
  const [maxRecordsPerPage, setMaxRecordsPerPage] = useState(12);

  const [searchBarValue, setSearchBarValue] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CATEGORY_ENUM | null>(null);

  const [open, setOpen] = useState(false);
  const [vaultLocked, setVaultLocked] = useState(true);
  const [masterPassword, setMasterPassword] = useState('');
  const [showMasterPassword, setShowMasterPassword] = useState(false);

  /* =========================
     Pagination
  ========================= */
  const pageChangeHandler = (newPage: number) => {
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  };

  /* =========================
     File upload
  ========================= */
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || '').trim();
      setMasterPassword(text);
    };

    reader.readAsText(file);
  };

  /* =========================
     Vault lock / unlock
  ========================= */
  const handleVaultUnlock = () => {
    if (!masterPassword.trim()) {
      toast.error('Master password is required');
      return;
    }

    setVaultLocked(false);
    setOpen(false);
    setShowMasterPassword(false);
  };

  const handleVaultLock = () => {
    setVaultLocked(true);
    setMasterPassword('');
  };

  /* =========================
     Fetch passwords
  ========================= */
  const fetchPasswords = useCallback(async () => {
    const response = await fetch(
      `/api/passwords/?maxRecordsPerPage=${maxRecordsPerPage}&currentPage=${currentPage}&name=${searchBarValue}&category=${selectedCategory}`,
    );

    const result: PasswordsResponse = await response.json();

    if (result.status === 'success' && result.data) {
      setPasswords(result.data.passwords);
      setTotalPages(result.data.totalPages);
    } else {
      toast.error(result.message);
    }
  }, [maxRecordsPerPage, currentPage, searchBarValue, selectedCategory]);

  /* =========================
     Delete password
  ========================= */
  const handlePasswordDelete = async (passwordId: string) => {
    const response = await fetch(`/api/password/?passwordId=${passwordId}`, {
      method: 'DELETE',
    });

    const result: {
      status: 'success' | 'error';
      message: string;
    } = await response.json();

    if (result.status === 'success') {
      toast.success(result.message);
      await fetchPasswords();
    } else {
      toast.error(result.message);
    }
  };

  /* =========================
     Effects
  ========================= */
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!cancelled) {
        await fetchPasswords();
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [fetchPasswords]);

  return (
    <div className="flex flex-col m-6">
      {/* Vault controls */}
      <section className="flex justify-center items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          {vaultLocked ? (
            <Button onClick={() => setOpen(true)}>Unlock Vault</Button>
          ) : (
            <ConfirmationBox
              title="Lock vault?"
              description="You will need your master password to unlock again."
              confirmationHandler={handleVaultLock}
            >
              <Button>Lock Vault</Button>
            </ConfirmationBox>
          )}

          <DialogContent className="backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Enter your Master Password</DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-2 mt-4">
              <div className="relative">
                <Input
                  placeholder="Enter master password"
                  value={masterPassword}
                  type={showMasterPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  onChange={(e) => setMasterPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowMasterPassword((p) => !p)}
                >
                  {showMasterPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>

              <span className="text-center">OR</span>

              <Input type="file" accept=".txt" onChange={onFileChange} />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setMasterPassword('');
                  setShowMasterPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleVaultUnlock}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Filters */}
      <section className="flex flex-wrap justify-center gap-4 mt-8">
        <SearchBar setSearchBarValue={setSearchBarValue} />
        <FilterDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {!vaultLocked && (
          <AddPassword
            fetchPasswords={fetchPasswords}
            masterPassword={masterPassword}
          />
        )}
      </section>

      {/* Pagination + content */}
      <section className="mt-6">
        <div className="flex flex-wrap justify-center gap-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageChangeHandler={pageChangeHandler}
          />

          <div className="flex items-center gap-2">
            <Label htmlFor="maxRecordsPerPage">Max Records/Page:</Label>
            <Input
              id="maxRecordsPerPage"
              type="number"
              min={1}
              className="max-w-20"
              value={maxRecordsPerPage}
              onChange={(e) =>
                setMaxRecordsPerPage(Math.max(Number(e.target.value) || 1, 1))
              }
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          {passwords.length ? (
            passwords
              .filter(
                (password) =>
                  typeof password._id === 'string' && password._id.length > 0,
              )
              .map((password, index) => (
                <PasswordItem
                  key={password._id ?? `password-${index}`}
                  passwordData={password}
                  vaultLocked={vaultLocked}
                  masterPassword={masterPassword}
                  handlePasswordDelete={handlePasswordDelete}
                />
              ))
          ) : (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-center">
                  No Passwords Added
                </CardTitle>
                <CardDescription className="text-center mt-2">
                  Start adding credentials to manage them securely.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default Passwords;
