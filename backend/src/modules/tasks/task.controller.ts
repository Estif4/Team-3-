import { asyncHandler } from "../../utils/asyncHandler";
import { pick } from "../../utils/pick";
import { TASK_FIELDS, type TaskInput } from "./task.types";
import * as taskService from "./task.service";

export const list = asyncHandler(async (req, res) => {
  res.json(await taskService.listTasks(req.params.boardId, req.user!.id));
});

export const create = asyncHandler(async (req, res) => {
  const input = pick<TaskInput>(req.body, TASK_FIELDS);
  const task = await taskService.createTask(
    req.params.boardId,
    req.user!.id,
    input,
  );
  res.status(201).json(task);
});

export const getOne = asyncHandler(async (req, res) => {
  res.json(await taskService.getTask(req.params.taskId, req.user!.id));
});

export const update = asyncHandler(async (req, res) => {
  const input = pick<TaskInput>(req.body, TASK_FIELDS);
  const task = await taskService.updateTask(
    req.params.taskId,
    req.user!.id,
    input,
  );
  res.json(task);
});

export const remove = asyncHandler(async (req, res) => {
  await taskService.deleteTask(req.params.taskId, req.user!.id);
  res.status(204).send();
});
