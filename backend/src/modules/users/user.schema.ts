import { Request, Response, NextFunction } from "express";

export const validateUpdateUser = (req: Request, res: Response, next: NextFunction): void => {
  const { displayName, avatarColor } = req.body;
  const errors: { field: string; message: string }[] = [];

  if (displayName !== undefined) {
    if (typeof displayName !== "string" || displayName.trim().length < 2) {
      errors.push({ field: "displayName", message: "Display name must be at least 2 characters long." });
    } else if (displayName.trim().length > 50) {
      errors.push({ field: "displayName", message: "Display name cannot exceed 50 characters." });
    }
  }

  if (avatarColor !== undefined) {
    const HEX_COLOR_REGEX = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (typeof avatarColor !== "string" || !HEX_COLOR_REGEX.test(avatarColor)) {
      errors.push({ field: "avatarColor", message: "Avatar color must be a valid hex color code (e.g. #3498db)." });
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ error: "Validation failed", details: errors });
    return;
  }

  next();
};
