import User from "@/models/user";
import connectDb from "./mongoose";
import Password from "@/models/password";

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

export async function getUserPasswords(userId: string) {
  await connectDb();
  const passwords = await Password.find({
    userId,
    isActive: true,
    isDeleted: false,
  })
    .limit(12)
    .skip(0)
    .sort([["name", "asc"]])
    .exec();

  const totalPages = Math.ceil(
    (await Password.countDocuments({
      userId,
      isActive: true,
      isDeleted: false,
    })) / 12
  );
  return { passwords, totalPages };
}
