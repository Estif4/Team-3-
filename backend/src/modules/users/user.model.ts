import { Schema, model } from "mongoose";
import type { IUser } from "./user.types";
import { toJSONOptions } from "../../utils/toJSONOptions";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      ...toJSONOptions,
      transform: (doc, ret) => {
        delete ret.password;
        return toJSONOptions.transform(doc, ret);
      },
    },
  },
);

export const User = model<IUser>("User", userSchema);
