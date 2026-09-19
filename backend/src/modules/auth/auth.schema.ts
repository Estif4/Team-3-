import { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegister = (req: Request, res: Response, next: NextFunction): void => {
  const rawName = req.body.displayName || req.body.name;
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!rawName || typeof rawName !== "string" || rawName.trim().length < 2) {
    errors.push({ field: "displayName", message: "Name must be at least 2 characters long." });
  } else if (rawName.trim().length > 50) {
    errors.push({ field: "displayName", message: "Name cannot exceed 50 characters." });
  }

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Please provide a valid email address." });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters long." });
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Validation failed", details: errors });
    return;
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction): void => {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (!email || typeof email !== "string" || !EMAIL_REGEX.test(email.trim())) {
    errors.push({ field: "email", message: "Please provide a valid email address." });
  }

  if (!password || typeof password !== "string" || !password) {
    errors.push({ field: "password", message: "Password is required." });
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Validation failed", details: errors });
    return;
  }

  next();
};
