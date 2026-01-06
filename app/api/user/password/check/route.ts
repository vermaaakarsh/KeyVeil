import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import connectDb from '@/lib/mongoose';
import User from '@/models/user';

/* =========================
   Helper: get userId from JWT
========================= */
async function getUserIdFromRequest(): Promise<Types.ObjectId> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = jwt.verify(
    token,
    process.env.JWT_ENCRYPTION_SECRET_SALT!,
  ) as { userId: string };

  return new Types.ObjectId(payload.userId);
}

/* =========================
   POST — Check user password
========================= */
export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserIdFromRequest();
    const userData = await request.json();

    const user = await User.findById(userId);

    if (!user || !user.isActive || user.isDeleted) {
      return NextResponse.json({
        status: 'error',
        message: 'User not found!',
        data: {},
      });
    }

    const isCorrect = await bcrypt.compare(userData.password, user.password);

    if (!isCorrect) {
      return NextResponse.json({
        status: 'error',
        message: 'Credentials Mismatched!',
        data: { isCorrectPassword: false },
      });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Password is correct!',
      data: { isCorrectPassword: true },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while checking password.',
        data: {},
      },
      { status: 401 },
    );
  }
}
