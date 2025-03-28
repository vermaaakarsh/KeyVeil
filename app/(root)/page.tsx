import Passwords from "@/components/Passwords";
import { cookies } from "next/headers";
import { getUserDetails, getUserPasswords } from "@/lib/actions";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const { userId } = JSON.parse(atob(token!.split(".")[1]));
  const user = JSON.parse(JSON.stringify(await getUserDetails(userId)));
  const { passwords, totalPages } = JSON.parse(
    JSON.stringify(await getUserPasswords(userId))
  );

  return (
    <div>
      <Navbar user={user} />
      <Passwords initialPasswords={passwords} initialTotalPages={totalPages} />
    </div>
  );
}
