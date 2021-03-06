// Here lies all the instance methods for user model.

import jwt from 'jsonwebtoken';
import { IUserDocument } from './user.types';

// eslint-disable-next-line import/prefer-default-export
export async function generateToken(this: IUserDocument): Promise<string> {
  const tokenData = this.toJSON();
  return jwt.sign(tokenData, process.env.JWT_KEY || 'jsonwebtoken');
}
