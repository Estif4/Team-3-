import type { HydratedDocument, Types } from "mongoose";

export interface IBoard {
  title: string;
  description: string;
  owner: Types.ObjectId;
  members: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type BoardDoc = HydratedDocument<IBoard>;

export const BOARD_FIELDS = ["title", "description"] as const;
export interface BoardInput {
  title?: string;
  description?: string;
}
