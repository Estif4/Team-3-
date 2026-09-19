import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { displayName, email, password } = req.body;
            const result = await AuthService.register({ displayName, email, password });
            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login(email, password);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }
}