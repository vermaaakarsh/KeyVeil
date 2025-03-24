import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

const mongoConnectionUri = process.env.MONGO_CONNECTION_URI ?? "";

const connectDb =
  (handler: Handler) => async (req: NextRequest, res: NextResponse) => {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }
    await mongoose.connect(mongoConnectionUri);
    return handler(req, res);
  };

export default connectDb;
