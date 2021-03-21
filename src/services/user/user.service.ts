import { User } from '@models/index';
import bcrypt from 'bcrypt';
import createError from 'http-errors';

/** Checks if the user with given credentials exists. If yes, generates auth token. */
export const loginUser = async (credentials: {
  email: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const user = await User.findOne({ where: { email: credentials.email } });
  if (!user) throw new createError.Unauthorized('Invalid credentials.');

  const passwordMatches = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!passwordMatches)
    throw new createError.Unauthorized('Invalid credentials.');

  const token = user.generateToken();

  return { user, token };
};

/** Creates new user and generates auth token. */
export const createUser = async (userAttributes: {
  email: string;
  name: string;
  password: string;
}): Promise<{ user: User; token: string }> => {
  const doesUserExist = await User.findOne({
    where: { email: userAttributes.email },
  });

  if (doesUserExist)
    throw new createError.BadRequest('User with the email already exist.');

  const user = await User.create(userAttributes);

  const token = user.generateToken();
  return { user, token };
};

/** Fetches the user with given id. */
export const fetchUserById = async (id: number): Promise<User | null> => {
  const user = await User.findByPk(id);
  return user;
};

export default { loginUser, createUser, fetchUserById };
