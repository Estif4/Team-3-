import { Request, Response, NextFunction, CookieOptions } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_hackathon_key";

export interface AuthUserPayload {
  id: string;
  userId: string;
  role?: string;
  email?: string;
  [key: string]: any;
}

export interface AuthRequest extends Request {
  user: AuthUserPayload;
}

/**
 * Standard HttpOnly Cookie Options
 */
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/**
 * Shared token verification helper used across HTTP and WebSockets
 */
export const verifyToken = (token: string): AuthUserPayload => {
  const decoded = jwt.verify(token, JWT_SECRET) as any;
  const userId = decoded.userId || decoded.id;

  if (!userId) {
    throw new Error("Invalid token payload.");
  }

  return {
    ...decoded,
    id: userId,
    userId: userId,
    role: decoded.role || "MEMBER",
  };
};

/**
 * Express HTTP Authentication Middleware
 * Checks HttpOnly cookie first, then falls back to Authorization Bearer header
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  try {
    const user = verifyToken(token);
    (req as AuthRequest).user = user;
    next();
  } catch (error: any) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

/**
 * Socket.IO Authentication Middleware
 * Checks handshake auth token or cookie header
 */
export const socketAuth = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  let token = socket.handshake.auth?.token;

  if (!token && socket.handshake.headers.cookie) {
    const cookies = socket.handshake.headers.cookie.split(";");
    for (const c of cookies) {
      const [key, value] = c.trim().split("=");
      if (key === "token") {
        token = decodeURIComponent(value);
        break;
      }
    }
  }

  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const user = verifyToken(token);
    socket.data.userId = user.userId;
    socket.data.user = user;
    next();
  } catch (error: any) {
    next(new Error("Authentication error: Invalid or expired token"));
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const authReq = req as AuthRequest;
    if (!authReq.user || !roles.includes(authReq.user.role || "")) {
      res.status(403).json({ error: "Forbidden: You do not have permission to perform this action." });
      return;
    }
    next();
  };
};

export const authenticate = requireAuth;
export const protect = requireAuth;
