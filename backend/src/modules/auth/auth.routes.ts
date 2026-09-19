import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRegister, validateLogin } from "./auth.schema";

const router = Router();

router.post("/register", validateRegister, AuthController.register);
router.post("/login", validateLogin, AuthController.login);
router.post("/logout", AuthController.logout);

export default router;