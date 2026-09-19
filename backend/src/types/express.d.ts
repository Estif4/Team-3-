import { AuthUserPayload } from "../middleware/auth.middleware";

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}

export {};

