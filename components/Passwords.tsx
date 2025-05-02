"use client";

import PasswordItem from "./PasswordItem";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TPassword } from "@/types/TPassword";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import SearchBar from "./SearchBar";
import FilterDropdown from "./FilterDropdown";
import AddPassword from "./AddPassword";
import { CATEGORY_ENUM } from "@/lib/enums";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";
import ConfirmationBox from "./ConfirmationBox";

const Passwords = ({
  initialPasswords,
  initialTotalPages,
}: {
  initialPasswords: TPassword[];
  initialTotalPages: number;
}) => {
  const [passwords, setPasswords] = useState<TPassword[]>(initialPasswords);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [maxRecordsPerPage, setMaxRecordsPerPage] = useState<number>(12);
  const [maxRecordsPerPageInput, setMaxRecordsPerPageInput] =
    useState<number>(maxRecordsPerPage);
  const [searchBarValue, setSearchBarValue] = useState<string>("");
  const [selectedCategory, setSelectedCategory] =
    useState<CATEGORY_ENUM | null>(null);
  const [open, setOpen] = useState(false);
  const [masterPassword, setMasterPassword] = useState("");
  const [showMasterPassword, setShowMasterPassword] = useState(false);
  const [vaultLocked, setVaultLocked] = useState(true);

  const pageChangeHandler = (newPage: number) => {
    if (currentPage != newPage) {
      setCurrentPage(newPage);
    }
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file;
    if (event.target.files) {
      file = event.target.files[0];
    }
    if (!file) {
      return;
    }
    const reader = new FileReader();

    reader.onload = () => {
      const text = (reader.result as string).trim();
      setMasterPassword(text);
    };

    reader.readAsText(file);
  };

  const handleVaultUnlock = () => {
    setVaultLocked(false);
    setOpen(false);
    setShowMasterPassword(false);
  };

  const fetchPasswords = async () => {
    const response = await fetch(
      `/api/passwords/?maxRecordsPerPage=${maxRecordsPerPage}&currentPage=${currentPage}&name=${searchBarValue}&category=${selectedCategory}`,
      {
        method: "GET",
      }
    );
    const { status, message, data }: ICustomResponse = await response.json();
    if (status === "success") {
      setTotalPages(data?.totalPages);
      setPasswords(data?.passwords);
    } else {
      toast.error(message);
    }
  };

  const handlePasswordDelete = async (passwordId: string) => {
    const response = await fetch(`/api/password/?passwordId=${passwordId}`, {
      method: "Delete",
    });
    const { status, message }: ICustomResponse = await response.json();
    if (status === "success") {
      toast.success(message);
    } else {
      toast.error(message);
    }
    fetchPasswords();
  };

  useEffect(() => {
    if (
      maxRecordsPerPageInput !== maxRecordsPerPage &&
      maxRecordsPerPageInput > 0
    ) {
      setMaxRecordsPerPage(maxRecordsPerPageInput);
    }
  }, [maxRecordsPerPageInput]);
  useEffect(() => {
    fetchPasswords();
  }, [currentPage, maxRecordsPerPage, searchBarValue, selectedCategory]);

  return (
    <div className="flex flex-col m-6">
      <section className="flex justify-center items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          {vaultLocked ? (
            <Button
              variant="default"
              onClick={() => {
                setOpen(true);
              }}
            >
              Unlock Vault
            </Button>
          ) : (
            <ConfirmationBox
              title="Are you sure you want to lock your vault?"
              description={
                "You will need to re-enter your Master Password to unlock again."
              }
              confirmationHandler={() => {
                setVaultLocked(true);
                setMasterPassword("");
              }}
            >
              <Button variant="default">Lock Vault</Button>
            </ConfirmationBox>
          )}
          <DialogContent className="mlr-15 backdrop-blur-sm">
            <DialogHeader>
              <DialogTitle>Enter your Master Password</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-1 mt-4 mb-2">
              <div className="relative">
                <Input
                  name="masterPassword"
                  placeholder="Enter your master password"
                  value={masterPassword}
                  type={showMasterPassword ? "text" : "password"}
                  required
                  autoComplete={"new-password"}
                  onChange={(e) => {
                    setMasterPassword(e.target.value);
                  }}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowMasterPassword((prev) => !prev)}
                >
                  {showMasterPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </Button>
              </div>
              <span className="flex justify-center items-center">OR</span>
              <Input
                name="masterPasswordFile"
                placeholder="Upload the master password file"
                type="file"
                accept=".txt"
                className="h-15 cursor-pointer"
                onChange={onFileChange}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setMasterPassword("");
                  setShowMasterPassword(false);
                }}
              >
                Cancel
              </Button>
              <Button variant="default" onClick={handleVaultUnlock}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
      <section className="flex flex-col md:flex-row lg:flex-row justify-center items-center w-full gap-4 mt-8 ">
        <SearchBar setSearchBarValue={setSearchBarValue} />
        <FilterDropdown
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        {!vaultLocked && <AddPassword fetchPasswords={fetchPasswords} />}
      </section>

      <section className="mt-5 ml-6.5 mr-6.5">
        <div className="flex flex-col md:flex-row lg:flex-row justify-center items-center md:items-baseline lg:items-baseline gap-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageChangeHandler={pageChangeHandler}
          />
          <div className="flex flex-row justify-center items-center gap-2">
            <Label htmlFor="maxRecordsPerPage">Max Records/Page:</Label>
            <Input
              name="maxRecordsPerPage"
              id="maxRecordsPerPage"
              type="number"
              className="max-w-20"
              min={0}
              value={maxRecordsPerPageInput}
              onChange={(e) => {
                e.preventDefault();
                setMaxRecordsPerPageInput(
                  (e.target.value as unknown as number) >= 0
                    ? (e.target.value as unknown as number)
                    : 0
                );
              }}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center items-center gap-4 mt-4">
          {passwords.length ? (
            passwords.map((passwordData) => (
              <PasswordItem
                key={passwordData._id + passwordData.name}
                passwordData={{
                  _id: passwordData._id?.toString() ?? "",
                  name: passwordData.name,
                  username: passwordData.username,
                  url: passwordData.url,
                  password: passwordData.password,
                  passwordLastUpdated: passwordData.passwordLastUpdated,
                  category: passwordData.category,
                }}
                vaultLocked={vaultLocked}
                masterPassword={masterPassword}
                handlePasswordDelete={handlePasswordDelete}
              />
            ))
          ) : (
            <Card className="w-full border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50">
              <CardHeader>
                <CardTitle className="flex justify-center items-center text-center">
                  No Password Added!
                </CardTitle>
                <CardDescription className="flex justify-center items-center mt-4">
                  <div className="text-center">
                    Start adding your credentials to manage them securely.
                  </div>
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
