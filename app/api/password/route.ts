import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import connectDb from '@/lib/mongoose';
import Password from '@/models/password';

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
   POST — Add password
========================= */
export async function POST(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserIdFromRequest();
    const data = await request.json();

    const password = new Password({
      userId,
      name: data.name,
      username: data.username,
      url: data.url,
      password: data.password,
      category: data.category,
      passwordLastUpdated: new Date(),
    });

    await password.save();

    return NextResponse.json({
      status: 'success',
      message: 'Password added successfully!',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while adding password.',
        data: {},
      },
      { status: 401 },
    );
  }
}

/* =========================
   PUT — Update password
========================= */
export async function PUT(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserIdFromRequest();
    const passwordId = request.nextUrl.searchParams.get('passwordId');

    if (!passwordId) {
      return NextResponse.json({
        status: 'error',
        message: 'Password ID is required',
        data: {},
      });
    }

    const data = await request.json();
    const password = await Password.findById(passwordId);

    if (
      !password ||
      password.isDeleted ||
      password.userId.toString() !== userId.toString()
    ) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid request!',
        data: {},
      });
    }

    password.name = data.name ?? password.name;
    password.username = data.username ?? password.username;
    password.url = data.url ?? password.url;
    password.category = data.category ?? password.category;

    if (data.password && data.password !== password.password) {
      password.password = data.password;
      password.passwordLastUpdated = new Date();
    }

    await password.save();

    return NextResponse.json({
      status: 'success',
      message: 'Password updated successfully!',
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

/* =========================
   DELETE — Delete password
========================= */
export async function DELETE(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserIdFromRequest();
    const passwordId = request.nextUrl.searchParams.get('passwordId');

    if (!passwordId) {
      return NextResponse.json({
        status: 'error',
        message: 'Password ID is required',
        data: {},
      });
    }

    const password = await Password.findById(passwordId);

    if (!password || password.userId.toString() !== userId.toString()) {
      return NextResponse.json({
        status: 'error',
        message: 'Invalid request!',
        data: {},
      });
    }

    password.isDeleted = true;
    await password.save();

    return NextResponse.json({
      status: 'success',
      message: 'Password deleted successfully!',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while deleting password.',
        data: {},
      },
      { status: 401 },
    );
  }
}
