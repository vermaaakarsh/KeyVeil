import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";
import User from "@/models/user";

const handler = async (request: NextRequest) => {
  try {
    await connectDb();
    const userId = request.userId as unknown as Types.ObjectId;
    const userData = await request.json();

    const user = await User.findById(userId);
    if (!user?.isActive || user?.isDeleted) {
      return NextResponse.json({
        status: "error",
        message: "User not found!",
        data: {},
      });
    }

    const status = await bcrypt.compare(userData.password, user.password);
    if (!status) {
      return NextResponse.json({
        status: "error",
        message: "Credentials Mismatched!",
        data: { isCorrectPassword: false },
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Password is correct!",
      data: { isCorrectPassword: true },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while checking password.",
      data: {},
    });
  }
};

export const POST = withAuth(handler);
