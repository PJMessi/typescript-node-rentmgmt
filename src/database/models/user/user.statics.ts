/**
 * Define all the static methods for the user mode here.
 * After defining the method here:
 *  1. make sure to declare the method in the IUserModel interface in user.types.ts.
 *  2. make sure to assign the method in userSchema in user.schema.ts.
 */
import { IUserModel } from './user.types';

// eslint-disable-next-line import/prefer-default-export
export async function findCount(this: IUserModel): Promise<number> {
  const count = await this.count();
  return count;
}
