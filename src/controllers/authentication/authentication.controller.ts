import { NextFunction, Request, Response } from 'express';
import userService from '@root/services/user/user.service';
import createError from 'http-errors';

/**
 * POST /auth/register
 * Registers new user and provides auth token.
 * @param req
 * @param res
 * @param next
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

    const { user, token } = await userService.createUser(requestBody);

    return res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /auth/login
 * Provides auth token if the credentials are valid.
 * @param req
 * @param res
 * @param next
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

    const { user, token } = await userService.loginUser(requestBody);

    return res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * GET /auth/profile
 * Fetches the data of the user of the bearer token.
 * @param req
 * @param res
 * @param next
 */
export const fetchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { user } = req.auth;
    if (!user) {
      throw new createError.Unauthorized();
    }

    return res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    return next(error);
  }
};
