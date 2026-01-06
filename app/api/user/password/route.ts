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
   PUT — Change user password
========================= */
export async function PUT(request: NextRequest) {
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

    const encryptedPassword = await bcrypt.hash(userData.password, 12);

    user.password = encryptedPassword;
    await user.save();

    // Force re-login by clearing auth cookie
    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({
      status: 'success',
      message:
        'Password updated successfully! Kindly re-login using the new password.',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while updating password.',
        data: {},
      },
      { status: 401 },
    );
  }
}
