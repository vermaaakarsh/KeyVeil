import { NextResponse } from "next/server";

import User from "@/models/user";
import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";

const handler = async (request: Request) => {
  try {
    const userId = request.userId;
    const user = await User.findById(userId);
    if (!user?.isActive || user?.isDeleted) {
      return NextResponse.json({
        status: "error",
        message: "User not Found!",
        data: {},
      });
    }
    return NextResponse.json({
      status: "success",
      message: "User data retrieved",
      data: { user },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while retrieving the user.",
      data: {},
    });
  }
};

export const GET = withAuth(connectDb(handler));
