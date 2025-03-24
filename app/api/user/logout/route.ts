import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import connectDb from "@/lib/mongoose";
import { withAuth } from "@/lib/with-auth";

const handler = async () => {
  try {
    await connectDb();
    const cookieStore = await cookies();
    cookieStore.delete("token");
    return NextResponse.json({
      status: "success",
      message: "Logging out!",
      data: {},
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      status: "error",
      message: "Something went wrong while logging out.",
      data: {},
    });
  }
};

export const GET = withAuth(handler);
