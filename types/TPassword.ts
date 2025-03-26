import { CATEGORY_ENUM } from "@/lib/enums";
import { Types } from "mongoose";

export type TPassword = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  username: string;
  url: string;
  password: string;
  category: CATEGORY_ENUM;
  passwordLastUpdated: Date;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
