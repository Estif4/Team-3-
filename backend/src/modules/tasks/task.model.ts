import { Schema, model } from "mongoose";
import { TASK_PRIORITIES, TASK_STATUSES, type ITask } from "./task.types";
import { toJSONOptions } from "../../utils/toJSONOptions";

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: `Status must be one of: ${TASK_STATUSES.join(", ")}`,
      },
      default: "todo",
    },
    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: `Priority must be one of: ${TASK_PRIORITIES.join(", ")}`,
      },
      default: "medium",
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: "Board",
      required: true,
      index: true,
    },
    assignee: { type: Schema.Types.ObjectId, ref: "User", default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, default: null },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

taskSchema.index({ board: 1, status: 1 });

export const Task = model<ITask>("Task", taskSchema);
