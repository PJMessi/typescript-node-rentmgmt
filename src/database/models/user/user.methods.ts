/**
 * Define all the instance methods for the user mode here.
 * After defining the method here:
 *  1. make sure to declare the method in IUserDocument interface in user.types.ts.
 *  2. make sure to assign the method in userSchema in user.schema.ts
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
