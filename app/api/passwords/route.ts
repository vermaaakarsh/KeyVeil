import { NextResponse } from "next/server";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";
import Password from "@/models/password";
import { CATEGORY_ENUM } from "@/lib/enums";

const getPasswords = async (request: NextRequest) => {
  try {
    await connectDb();
    const maxRecordsPerPage: number = <number>(
      (request.nextUrl.searchParams.get("maxRecordsPerPage") ?? 0)
    );
    const currentPage = <number>(
      (request.nextUrl.searchParams.get("currentPage") ?? 0)
    );
    const name = request.nextUrl.searchParams.get("name");
    const category = request.nextUrl.searchParams.get("category");
    const sortBy = request.nextUrl.searchParams.get("sortBy");
    const sortOrder = request.nextUrl.searchParams.get("sortBy");

    const filterObject: {
      userId: string;
      isActive: boolean;
      isDeleted: boolean;
      category?: CATEGORY_ENUM;
      name?: object;
    } = {
      userId: request.userId,
      isActive: true,
      isDeleted: false,
    };

    if (name || name !== "") {
      filterObject.name = { $regex: name, $options: "i" };
    }
    if (category && category !== "null") {
      filterObject.category = category as unknown as CATEGORY_ENUM;
    }

    const passwords = await Password.find(filterObject)
      .limit(maxRecordsPerPage)
      .skip(maxRecordsPerPage * (currentPage - 1))
      .sort([[sortBy ?? "name", sortOrder === "desc" ? "desc" : "asc"]])
      .exec();
    const totalPages = Math.ceil(
      (await Password.countDocuments(filterObject)) / maxRecordsPerPage
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

export const GET = withAuth(getPasswords);
