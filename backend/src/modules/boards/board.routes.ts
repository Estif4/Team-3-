import { Router } from "express";
import { boardTasksRouter } from "../tasks/task.routes";
import * as controller from "./board.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.use(protect); 

router.route("/").get(controller.list).post(controller.create);

router
  .route("/:boardId")
  .get(controller.getOne)
  .patch(controller.update)
  .delete(controller.remove);

router.post("/:boardId/members", controller.addMember);
router.delete("/:boardId/members/:userId", controller.removeMember);

router.use("/:boardId/tasks", boardTasksRouter);

export default router;