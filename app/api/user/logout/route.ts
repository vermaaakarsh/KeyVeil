import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import connectDb from '@/lib/mongoose';

export async function GET() {
  try {
    await connectDb();

    const cookieStore = await cookies();
    cookieStore.delete('token');

    return NextResponse.json({
      status: 'success',
      message: 'Logging out!',
      data: {},
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while logging out.',
        data: {},
      },
      { status: 500 },
    );
  }
}
