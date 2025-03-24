import { Types } from "mongoose";

export type TUser = {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  isDeleted?: boolean;
};
