/**
 * Define all the instance methods for the user mode here.
 * After defining the method here, make sure to update the IUserDocument interface in user.types.ts.
 */

import jwt from 'jsonwebtoken';
import { IUserDocument, JwtEncodedUserData } from './user.types';

// eslint-disable-next-line import/prefer-default-export
export async function generateToken(this: IUserDocument): Promise<string> {
  const tokenData: JwtEncodedUserData = {
    id: this.id,
    name: this.name,
    email: this.email,
    password: this.password,
  };
  return jwt.sign(tokenData, process.env.JWT_KEY || 'jsonwebtoken');
}
