import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: unknown;
  error?: unknown;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: {
    success: boolean;
    message?: string;
    data?: T;
    meta?: unknown;
    error?: unknown;
  }
): Response => {
  return res.status(statusCode).json({
    success: payload.success,
    message: payload.message,
    data: payload.data,
    meta: payload.meta,
    error: payload.error,
  });
};

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: unknown
): Response => {
  return sendResponse(res, statusCode, {
    success: true,
    message,
    data,
    meta,
  });
};

export const sendError = (
  res: Response,
  message = 'Internal Server Error',
  statusCode = 500,
  error?: unknown
): Response => {
  return sendResponse(res, statusCode, {
    success: false,
    message,
    error,
  });
};
