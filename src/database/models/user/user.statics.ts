/**
 * Define all the static methods for the user mode here.
 * After defining the method here, make sure to update the IUserModel interface in user.types.ts.
 */
import { IUserModel } from './user.types';

// eslint-disable-next-line import/prefer-default-export
export async function findCount(this: IUserModel): Promise<number> {
  const count = await this.count();
  return count;
}
