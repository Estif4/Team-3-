import { Request, Response, NextFunction } from "express";
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
 */
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ error: "Access denied. No token provided." });
    return;
  }

  const token = authHeader.split(" ")[1];

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
 */
export const socketAuth = (
  socket: Socket,
  next: (err?: Error) => void
): void => {
  const token = socket.handshake.auth.token;

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
