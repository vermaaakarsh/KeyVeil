import User from "@/models/user";
import connectDb from "./mongoose";

export async function getUserDetails(userId: string) {
  await connectDb();
  const user = await User.findById(userId, {
    _id: 1,
    name: 1,
    email: 1,
    isActive: 1,
    isDeleted: 1,
    createdAt: 1,
    updatedAt: 1,
  });

  return user;
}
