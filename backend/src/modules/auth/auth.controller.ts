import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { cookieOptions } from "../../middleware/auth.middleware";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const { displayName, email, password, role, avatarColor } = req.body;
            const result = await AuthService.register({ displayName, email, password, role, avatarColor });

            // Set HttpOnly cookie
            res.cookie("token", result.token, cookieOptions);

            res.status(201).json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;
            const result = await AuthService.login({ email, password });

            // Set HttpOnly cookie
            res.cookie("token", result.token, cookieOptions);

            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json({ error: error.message });
        }
    }

    static async logout(_req: Request, res: Response) {
        try {
            res.clearCookie("token", {
                ...cookieOptions,
                maxAge: 0,
            });
            res.status(200).json({ success: true, message: "Logged out successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message });
        }
    }
}