import { NextFunction, Request, Response } from 'express';
import userService from '@root/services/user/user.service';
import createError from 'http-errors';

/**
 * Registers new user and provides auth token.
 * @route POST /auth/register
 */
export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const requestBody: {
      email: string;
      password: string;
      name: string;
    } = req.body;

    const user = await userService.createUser(requestBody);
    const token = user.generateToken();

    return res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Provides auth token if the credentials are valid.
 * @route POST /auth/login
 */
export const loginuser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const requestBody: {
      email: string;
      password: string;
    } = req.body;

    const user = await userService.fetchUserByCredentials(requestBody);
    const token = user.generateToken();

    return res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * Fetches the data of the user of the bearer token.
 * @route GET /auth/profile
 */
export const fetchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { user } = req.auth;
    if (!user) throw new createError.Unauthorized();

    return res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};

export default {
  registerUser,
  loginuser,
  fetchProfile,
};
