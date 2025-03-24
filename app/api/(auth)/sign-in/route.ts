import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import User from "@/models/user";
import connectDb from "@/lib/mongoose";

const handler = async (request: NextRequest) => {
  try {
    const cookieStore = await cookies();
    const userData = await request.json();
    const user = await User.findOne({ email: userData.email });
    if (!user) {
      return NextResponse.json({
        status: "error",
        message: "No account with this email address!",
        data: {},
      });
    }
    const status = await bcrypt.compare(userData.password, user.password);
    if (!status) {
      return NextResponse.json({
        status: "error",
        message: "Credentials Mismatched!",
        data: {},
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      `${user._id}${process.env.JWT_ENCRYPTION_SECRET_SALT}`,
      {
        algorithm: "HS256",
        expiresIn: "1h",
      }
    );
    cookieStore.set("token", token, {
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    return NextResponse.json({
      status: "success",
      message: "Signing in!",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while signing in.",
      data: {},
    });
  }
};

export const POST = connectDb(handler);
