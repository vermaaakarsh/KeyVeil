import { NextResponse } from "next/server";
import { Types } from "mongoose";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";
import Password from "@/models/password";

const addPassword = async (request: NextRequest) => {
  try {
    await connectDb();
    const userId = request.userId as unknown as Types.ObjectId;
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
      status: "success",
      message: "Password added successfully!",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while adding password.",
      data: {},
    });
  }
};

export const POST = withAuth(addPassword);
