import type { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let status = err.statusCode || err.status || 500;
  let message = err.message || "Something went wrong";

  if (err.name === "ValidationError") {
    status = 400;
    message = Object.values<any>(err.errors)[0].message;
  }

  if (err.name === "CastError") {
    status = 400;
    message = "Invalid id";
  }

  if (err.code === 11000) {
    status = 409;
    message = "Already exists";
  }

  if (status >= 500) {
    console.error(err);
    message = "Something went wrong on the server";
  }

  res.status(status).json({ success: false, message, error: message });
};
