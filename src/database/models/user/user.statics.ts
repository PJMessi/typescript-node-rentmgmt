// Here lies all the static methods for User model.

import { IUserModel } from './user.types';

// eslint-disable-next-line import/prefer-default-export
export async function findCount(this: IUserModel): Promise<number> {
  const count = await this.count();
  return count;
}
