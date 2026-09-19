import { Schema, model } from "mongoose";
import type { IBoard } from "./board.types";
import { toJSONOptions } from "../../utils/toJSONOptions";

const boardSchema = new Schema<IBoard>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, toJSON: toJSONOptions },
);

boardSchema.index({ members: 1 });

export const Board = model<IBoard>("Board", boardSchema);
