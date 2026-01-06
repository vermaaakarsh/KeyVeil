import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { Types } from 'mongoose';

export async function requireUserId(): Promise<Types.ObjectId> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Not Authenticated');
  }

  const decoded = jwt.verify(
    token,
    process.env.JWT_ENCRYPTION_SECRET_SALT!,
  ) as { userId: string };

  if (!decoded?.userId) {
    throw new Error('Not Authenticated');
  }

  return new Types.ObjectId(decoded.userId);
}
