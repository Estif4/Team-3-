import { AppError } from "../../utils/AppError";
import { isObjectId } from "../../utils/isObjectId";
import { getBoardForUser, hasAccess } from "../boards/board.service";
import type { BoardDoc } from "../boards/board.types";
import { Task } from "./task.model";
import type { TaskInput } from "./task.types";

const populateOpts = [
  { path: "assignee", select: "name email" },
  { path: "createdBy", select: "name email" },
];

const assertAssigneeOnBoard = (board: BoardDoc, assignee?: string | null) => {
  if (assignee === undefined || assignee === null) return;
  if (!isObjectId(assignee)) throw new AppError("Invalid assignee", 400);
  if (!hasAccess(board, assignee)) {
    throw new AppError("Assignee must be a member of this board", 400);
  }
};

const getTaskForUser = async (taskId: string, userId: string) => {
  const task = await Task.findById(taskId);
  if (!task) throw new AppError("Task not found", 404);
  const board = await getBoardForUser(task.board.toString(), userId).catch(
    () => {
      throw new AppError("Task not found", 404);
    },
  );
  return { task, board };
};

export const listTasks = async (boardId: string, userId: string) => {
  await getBoardForUser(boardId, userId);
  return Task.find({ board: boardId })
    .sort({ createdAt: -1 })
    .populate(populateOpts);
};

export const createTask = async (
  boardId: string,
  userId: string,
  input: TaskInput,
) => {
  const board = await getBoardForUser(boardId, userId);
  assertAssigneeOnBoard(board, input.assignee);

  const task = await Task.create({
    ...input,
    board: board._id,
    createdBy: userId,
  });
  return task.populate(populateOpts);
};

export const getTask = async (taskId: string, userId: string) => {
  const { task } = await getTaskForUser(taskId, userId);
  return task.populate(populateOpts);
};

export const updateTask = async (
  taskId: string,
  userId: string,
  input: TaskInput,
) => {
  const { task, board } = await getTaskForUser(taskId, userId);
  assertAssigneeOnBoard(board, input.assignee);

  Object.assign(task, input); // fields already whitelisted by the controller
  await task.save(); // runs the schema validators
  return task.populate(populateOpts);
};

export const deleteTask = async (taskId: string, userId: string) => {
  const { task } = await getTaskForUser(taskId, userId);
  await task.deleteOne();
};
