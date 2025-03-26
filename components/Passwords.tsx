"use client";
import PasswordItem from "./PasswordItem";
import Pagination from "./Pagination";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TPassword } from "@/types/TPassword";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const Passwords = () => {
  const [passwords, setPasswords] = useState<TPassword[]>([]);
  const [maxRecordsPerPage, setMaxRecordsPerPage] = useState<number>(10);
  const [maxRecordsPerPageInput, setMaxRecordsPerPageInput] =
    useState<number>(maxRecordsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  const pageChangeHandler = (newPage: number) => {
    if (currentPage != newPage) {
      setCurrentPage(newPage);
    }
  };

  const fetchPasswords = async () => {
    const response = await fetch(
      `/api/passwords/?maxRecordsPerPage=${maxRecordsPerPage}&currentPage=${currentPage}`,
      {
        method: "GET",
      }
    );
    const { status, message, data }: ICustomResponse = await response.json();
    if (status === "success") {
      console.log(data);
      setTotalPages(data?.totalPages);
      setPasswords(data?.passwords);
    } else {
      toast.error(message);
    }
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
  }, [currentPage, maxRecordsPerPage]);

  return (
    <div>
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
                name: passwordData.name,
                username: passwordData.username,
                url: passwordData.url,
                category: passwordData.category,
                passwordLastUpdated: passwordData.passwordLastUpdated,
              }}
            />
          ))
        ) : (
          <Card className="w-full border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:hover:bg-input/50">
            <CardHeader>
              <CardTitle className="flex justify-center items-center text-center">
                No Password Added!
              </CardTitle>
              <CardDescription></CardDescription>
              <CardDescription className="flex justify-center items-center mt-4">
                <div className="text-center">
                  Start adding your credentials to manage them securely.
                </div>
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Passwords;
