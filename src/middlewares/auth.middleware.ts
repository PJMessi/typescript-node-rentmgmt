import createError from 'http-errors';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { fetchUserById } from '@services/user/user.service';
import { JwtEncodedUserData } from '@models/user.model';

const parseBearerToken = (bearerToken: string): string => {
  return bearerToken.substring(7);
};

/**
 * Extracts User from the bearer token. Throws 401 if it token is invalid.
 * @param bearerToken
 */
const decodeData = (bearerToken: string): JwtEncodedUserData => {
  try {
    const JWT_SECRET = process.env.JWT_KEY || '';
    const jwtPayload = <JwtEncodedUserData>jwt.verify(bearerToken, JWT_SECRET);
    return jwtPayload;
  } catch (error) {
    throw new createError.Unauthorized();
  }
};

/**
 * Decodes the token and extracts the user's id. Fetches that user from the database and appends
 * it in the request. Throws 401 if token is invalid or user doesnt exist anymore.
 * @param req
 * @param res
 * @param next
 */
export default async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const bearerToken = req.headers.authorization;
    if (!bearerToken)
      throw new createError.Unauthorized('Bearer token not provided.');

    const decodedUser: JwtEncodedUserData = decodeData(
      parseBearerToken(bearerToken)
    );

    const user = await fetchUserById(decodedUser.id);
    if (!user) throw new createError.Unauthorized();

    req.auth = { user };

    return next();
  } catch (error) {
    return next(error);
  }
};
