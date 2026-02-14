import Passwords from '@/components/Passwords';
import Navbar from '@/components/Navbar';
import { getUserDetails, getUserPasswords } from '@/lib/actions';
import { requireUserId } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  let userId: string;

  try {
    const id = await requireUserId();
    userId = id.toString();
  } catch {
    redirect('/sign-in');
  }

  const user = structuredClone(await getUserDetails(userId));

  const { passwords, totalPages } = structuredClone(
    await getUserPasswords(userId),
  );

  return (
    <div>
      <Navbar user={user} />
      <Passwords initialPasswords={passwords} initialTotalPages={totalPages} />
    </div>
  );
}
