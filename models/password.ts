import { CATEGORY_ENUM } from "@/lib/enums";
import { TPassword } from "@/types/TPassword";
import mongoose from "mongoose";

const schema = mongoose.Schema;

const passwordSchema = new schema(
  {
    userId: {
      type: schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: CATEGORY_ENUM,
      required: true,
    },
    passwordLastUpdated: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Password =
  mongoose.models?.Password ??
  mongoose.model<TPassword>("Password", passwordSchema);

export default Password;
