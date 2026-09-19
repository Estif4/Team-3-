import { Request, Response } from "express";
import { UserService } from "./user.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export class UserController {
    static async getMe(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user.id; 
            const user = await UserService.getUserById(userId);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    static async updateMe(req: Request, res: Response) {
        try {
            const authReq = req as AuthRequest;
            const userId = authReq.user.id;
            const { displayName, avatarColor } = req.body;
            const updated = await UserService.updateUser(userId, { displayName, avatarColor });
            res.status(200).json(updated);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async getAllUsers(req: Request, res: Response) {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ error: "Failed to fetch users" });
        }
    }

    static async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const user = await UserService.getUserById(id);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }
}