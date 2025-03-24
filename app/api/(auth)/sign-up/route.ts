import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import User from "@/models/user";
import connectDb from "@/lib/mongoose";

const handler = async (request: Request) => {
  try {
    await connectDb();

    const userObject = await request.json();
    const encryptedPassword = await bcrypt.hash(userObject.password, 12);
    const user = new User({
      name: userObject.name,
      email: userObject.email,
      password: encryptedPassword,
    });
    await user.save();
    return NextResponse.json({
      status: "success",
      message: "Account created successfully! Please sign in to proceed.",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while creating your account.",
      data: {},
    });
  }
};

export const POST = handler;
