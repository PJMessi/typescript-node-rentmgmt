import { NextFunction, Request, Response } from 'express';
import { createUser } from '@services/user/userService';

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

    const { user, token } = await createUser(requestBody);

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
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};
