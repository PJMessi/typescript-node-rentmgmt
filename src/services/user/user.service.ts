import User from '@models/user/user.model';
import { IUserDocument } from '@models/user/user.types';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

/**
 * Checks if the user with given credentials exists. If yes, generates auth token.
 * @param credentials
 */
export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: IUserDocument; token: string }> => {
  const user = await User.findOne({ email: credentials.email });
  if (!user) throw new createError.Unauthorized('Invalid credentials.');

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.password
  );
  if (!passwordMatches)
    throw new createError.Unauthorized('Invalid credentials.');

  const token = await user.generateToken();
  return { user, token };
};

/**
 * Creates user with given data and generates auth token.
 * @param userAttributes
 */
export const createUser = async (userAttributes: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: IUserDocument; token: string }> => {
  const doesUserExist = await User.findOne({ email: userAttributes.email });
  if (doesUserExist) {
    throw new createError.BadRequest('User with the email already exist.');
  }

  const user = await User.create({
    ...userAttributes,
    password: await bcrypt.hash(userAttributes.password, 10),
  });

  const token = await user.generateToken();

  return { user, token };
};

/**
 * Fetches the user with given id.
 * @param id
 */
export const fetchUserById = async (
  id: string
): Promise<IUserDocument | null> => {
  const user = await User.findById(id);

  return user;
};

export default { loginUser, createUser, fetchUserById };
