import { NextResponse } from "next/server";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";
import Password from "@/models/password";

const handler = async (request: NextRequest) => {
  try {
    await connectDb();
    const maxRecordsPerPage: number = <number>(
      (request.nextUrl.searchParams.get("maxRecordsPerPage") ?? 0)
    );
    const currentPage = <number>(
      (request.nextUrl.searchParams.get("currentPage") ?? 0)
    );
    const sortBy = request.nextUrl.searchParams.get("sortBy");
    const sortOrder = request.nextUrl.searchParams.get("sortBy");

    const passwords = await Password.find({
      isActive: true,
      isDeleted: false,
    })
      .limit(maxRecordsPerPage)
      .skip(maxRecordsPerPage * (currentPage - 1))
      .sort([[sortBy ?? "name", sortOrder === "desc" ? "desc" : "asc"]])
      .exec();
    const totalPages = Math.ceil(
      (await Password.countDocuments()) / maxRecordsPerPage
    );
    return NextResponse.json({
      status: "success",
      message: "Passwords fetch successfully!",
      data: { passwords, totalPages },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while fetching passwords.",
      data: {},
    });
  }
};

export const GET = withAuth(handler);
