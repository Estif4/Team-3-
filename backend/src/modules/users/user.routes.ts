import { Router } from "express";
import { UserController } from "./user.controller";
import { requireAuth } from "../../middleware/auth.middleware";
import { validateUpdateUser } from "./user.schema";

const router = Router();

// Protect all user routes
router.use(requireAuth);

router.get("/me", UserController.getMe);
router.patch("/me", validateUpdateUser, UserController.updateMe);
router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);

export default router;