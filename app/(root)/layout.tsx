import Navbar from "@/components/Navbar";
import React from "react";
import { cookies } from "next/headers";
import { getUserDetails } from "@/lib/actions";

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { userId } = JSON.parse(atob(token!.split(".")[1]));
  const user = JSON.parse(JSON.stringify(await getUserDetails(userId)));

  return (
    <div>
      <Navbar user={user} />
      {children}
    </div>
  );
};

export default RootLayout;
