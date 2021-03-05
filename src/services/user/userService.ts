import User, { IUserDocument } from '@root/database/models/user/user.model';
import bcrypt from 'bcrypt';

/**
 * Creates user with given data and generates auth token.
 * @param userAttributes
 */
export const createUser = async (userAttributes: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: IUserDocument; token: string }> => {
  const user = await User.create({
    ...userAttributes,
    password: await bcrypt.hash(userAttributes.password, 10),
  });

  const token = await user.generateToken();

  return { user, token };
};

export const fetchUser = (): void => {};
