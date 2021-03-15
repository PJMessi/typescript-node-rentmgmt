import { User } from './database/models';

declare global {
  namespace Express {
    interface Request {
      auth: { user?: User };
    }
  }
}
