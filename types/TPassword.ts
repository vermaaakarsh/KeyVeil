import { CATEGORY_ENUM } from "@/lib/enums";
import { TEncryptedDataObject } from "@/services/cryptography/ICryptography";
import { Types } from "mongoose";

export type TPassword = {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  username: string;
  url: string;
  password: TEncryptedDataObject;
  category: CATEGORY_ENUM;
  passwordLastUpdated: Date;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
};
