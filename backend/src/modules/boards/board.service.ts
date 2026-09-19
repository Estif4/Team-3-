import { AppError } from "../../utils/AppError";
import { User } from "../users/user.model";
import { Task } from "../tasks/task.model";
import { Board } from "./board.model";
import type { BoardInput, BoardDoc } from "./board.types";

export const populateOpts = [
  { path: "owner", select: "name email" },
  { path: "members", select: "name email" },
];

export const hasAccess = (board: BoardDoc, userId: string): boolean =>
  board.owner.equals(userId) || board.members.some((m) => m.equals(userId));

const assertOwner = (board: BoardDoc, userId: string) => {
  if (!board.owner.equals(userId)) {
    throw new AppError("Only the board owner can do this", 403);
  }
};

export const getBoardForUser = async (
  boardId: string,
  userId: string,
): Promise<BoardDoc> => {
  const board = await Board.findById(boardId);
  if (!board || !hasAccess(board, userId)) {
    throw new AppError("Board not found", 404);
  }
  return board;
};

export const listBoards = (userId: string) =>
  Board.find({ $or: [{ owner: userId }, { members: userId }] })
    .sort({ updatedAt: -1 })
    .populate(populateOpts);

export const createBoard = async (userId: string, input: BoardInput) => {
  const board = await Board.create({ ...input, owner: userId, members: [] });
  return board.populate(populateOpts);
};

export const getBoard = async (boardId: string, userId: string) => {
  const board = await getBoardForUser(boardId, userId);
  return board.populate(populateOpts);
};

export const updateBoard = async (
  boardId: string,
  userId: string,
  input: BoardInput,
) => {
  const board = await getBoardForUser(boardId, userId);
  assertOwner(board, userId);
  Object.assign(board, input); 
  await board.save(); 
  return board.populate(populateOpts);
};

export const deleteBoard = async (boardId: string, userId: string) => {
  const board = await getBoardForUser(boardId, userId);
  assertOwner(board, userId);
  await Task.deleteMany({ board: board._id });
  await board.deleteOne();
};

export const addMember = async (
  boardId: string,
  userId: string,
  email: unknown,
) => {
  if (typeof email !== "string" || !email.trim()) {
    throw new AppError("Email is required", 400);
  }

  const board = await getBoardForUser(boardId, userId);
  assertOwner(board, userId);

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) throw new AppError("No user found with that email", 404);
  if (hasAccess(board, user.id)) {
    throw new AppError("User is already on this board", 409);
  }

  board.members.push(user._id);
  await board.save();
  return board.populate(populateOpts);
};

export const removeMember = async (
  boardId: string,
  requesterId: string,
  targetId: string,
) => {
  const board = await getBoardForUser(boardId, requesterId);

  if (board.owner.equals(targetId)) {
    throw new AppError("The owner cannot be removed", 400);
  }
  if (requesterId !== targetId) assertOwner(board, requesterId);

  if (!board.members.some((m) => m.equals(targetId))) {
    throw new AppError("Member not found on this board", 404);
  }

  board.members = board.members.filter((m) => !m.equals(targetId));
  await board.save();

  // Removed users shouldn't stay assigned to tasks
  await Task.updateMany(
    { board: board._id, assignee: targetId },
    { assignee: null },
  );

  return board.populate(populateOpts);
};
