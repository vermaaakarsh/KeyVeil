import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

import connectDb from '@/lib/mongoose';
import Password from '@/models/password';
import { CATEGORY_ENUM } from '@/lib/enums';

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
   GET — Fetch passwords
========================= */
export async function GET(request: NextRequest) {
  try {
    await connectDb();

    const userId = await getUserIdFromRequest();

    const searchParams = request.nextUrl.searchParams;

    const maxRecordsPerPage = Number(
      searchParams.get('maxRecordsPerPage') ?? 10,
    );
    const currentPage = Number(searchParams.get('currentPage') ?? 1);

    const name = searchParams.get('name')?.trim();
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') ?? 'name';
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1;

    /* =========================
       Build Mongo filter
    ========================= */
    const filterObject: {
      userId: Types.ObjectId;
      isActive: boolean;
      isDeleted: boolean;
      category?: CATEGORY_ENUM;
      name?: { $regex: string; $options: string };
    } = {
      userId,
      isActive: true,
      isDeleted: false,
    };

    if (name) {
      filterObject.name = { $regex: name, $options: 'i' };
    }

    if (category && category !== 'null') {
      filterObject.category = category as CATEGORY_ENUM;
    }

    /* =========================
       Query
    ========================= */
    const passwords = await Password.find(filterObject)
      .limit(maxRecordsPerPage)
      .skip(maxRecordsPerPage * (currentPage - 1))
      .sort({ [sortBy]: sortOrder })
      .exec();

    const totalRecords = await Password.countDocuments(filterObject);
    const totalPages = Math.ceil(totalRecords / maxRecordsPerPage);

    return NextResponse.json({
      status: 'success',
      message: 'Passwords fetched successfully!',
      data: { passwords, totalPages },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        status: 'error',
        message: 'Something went wrong while fetching passwords.',
        data: {},
      },
      { status: 401 },
    );
  }
}
