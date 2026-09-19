import { Router } from "express";
import * as controller from "./task.controller";
import { protect } from "../../middleware/auth.middleware";


export const boardTasksRouter = Router({ mergeParams: true });

boardTasksRouter.route("/").get(controller.list).post(controller.create);

// Mounted at /api/tasks
export const taskRouter = Router();

taskRouter.use(protect);

taskRouter
  .route("/:taskId")
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.remove);
