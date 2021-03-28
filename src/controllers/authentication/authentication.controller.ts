import { NextFunction, Request, Response } from 'express';
import userService from '@root/services/user/user.service';
import createError from 'http-errors';

export default {
  /**
   * Registers new user and provides auth token.
   * @route POST /auth/register
   */
  registerUser: async (
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
  },

  /**
   * Provides auth token if the credentials are valid.
   * @route POST /auth/login
   */
  loginuser: async (
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
  },

  /**
   * Fetches the data of the user of the bearer token.
   * @route GET /auth/profile
   */
  fetchProfile: async (
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
  },
};
