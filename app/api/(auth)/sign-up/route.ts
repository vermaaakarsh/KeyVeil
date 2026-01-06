import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

import User from '@/models/user';
import connectDb from '@/lib/mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Name, email, and password are required.',
          data: {},
        },
        { status: 400 },
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      name: name,
      email: email,
      password: encryptedPassword,
    });

    await user.save();

    return NextResponse.json({
      status: 'success',
      message: 'Account created successfully! Please sign in to proceed.',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      status: 'error',
      message: 'Something went wrong while creating your account.',
      data: {},
    });
  }
}
