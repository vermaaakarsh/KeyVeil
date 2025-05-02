import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";
import User from "@/models/user";
import { cookies } from "next/headers";

const changeUserPassword = async (request: NextRequest) => {
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
    const encryptedPassword = await bcrypt.hash(userData.password, 12);

    user.password = encryptedPassword;
    await user.save();

    const cookieStore = await cookies();
    cookieStore.delete("token");

    return NextResponse.json({
      status: "success",
      message:
        "Password updated successfully! Kindly re-login using the new password.",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while updating password.",
      data: {},
    });
  }
};

export const PUT = withAuth(changeUserPassword);
