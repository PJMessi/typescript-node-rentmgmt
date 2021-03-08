import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

/**
 * Creates new family with members.
 * @param req
 * @param res
 * @param next
 */
// eslint-disable-next-line import/prefer-default-export
export const createFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const requestBody: {
      name: string;
      status: 'LEFT' | 'ACTIVE';
      sourceOfIncome: string;
      membersList: {
        name: string;
        email?: string;
        mobile?: string;
        birthDay: Date;
      }[];
    } = req.body;

    const family = await familyService.createFamily(requestBody);

    return res.json({
      success: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};
