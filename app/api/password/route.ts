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

const updatePassword = async (request: NextRequest) => {
  try {
    await connectDb();
    const userId = request.userId as unknown as Types.ObjectId;
    const passwordId = request.nextUrl.searchParams.get("passwordId");
    const data = await request.json();

    const password = await Password.findById(passwordId);
    if (!password.isDeleted || password.userId !== userId) {
      return NextResponse.json({
        status: "error",
        message: "Invalid request!",
        data: {},
      });
    }
    if (data.name !== password.name) {
      password.name = data.name;
    }
    if (data.username !== password.username) {
      password.username = data.username;
    }
    if (data.url !== password.url) {
      password.url = data.url;
    }
    if (data.password !== password.password) {
      password.password = data.password;
      password.passwordLastUpdated = new Date();
    }
    if (data.category !== password.category) {
      password.category = data.category;
    }
    await password.save();
    return NextResponse.json({
      status: "success",
      message: "Password updated successfully!",
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

const deletePassword = async (request: NextRequest) => {
  try {
    await connectDb();
    const userId = request.userId as unknown as Types.ObjectId;

    const passwordId = request.nextUrl.searchParams.get("passwordId");

    const password = await Password.findById(passwordId);
    if (!password || password.userId.toString() !== userId.toString()) {
      return NextResponse.json({
        status: "error",
        message: "Invalid request!",
        data: {},
      });
    }
    password.isDeleted = true;
    await password.save();
    return NextResponse.json({
      status: "success",
      message: "Password deleted successfully!",
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
export const UPDATE = withAuth(updatePassword);
export const DELETE = withAuth(deletePassword);
