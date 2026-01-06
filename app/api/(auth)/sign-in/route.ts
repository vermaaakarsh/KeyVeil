import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

import User from '@/models/user';
import connectDb from '@/lib/mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const userData = await request.json();
    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return NextResponse.json({
        status: 'error',
        message: 'No account with this email address!',
        data: {},
      });
    }

    const valid = await bcrypt.compare(userData.password, user.password);

    if (!valid) {
      return NextResponse.json({
        status: 'error',
        message: 'Credentials Mismatched!',
        data: {},
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_ENCRYPTION_SECRET_SALT!,
      {
        algorithm: 'HS256',
        expiresIn: '1h',
      },
    );

    const cookieStore = await cookies();

    cookieStore.set('token', token, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return NextResponse.json({
      status: 'success',
      message: 'Signing in!',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while signing in.',
        data: {},
      },
      { status: 500 },
    );
  }
}
