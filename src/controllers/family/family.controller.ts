import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

/**
 * POST /families/:familyId
 * Fetches the Room with given id along with the information about the room they
 * are using and the family members.
 */
// eslint-disable-next-line import/prefer-default-export
export const fetchFamily = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { familyId } = req.params;
    const family = await familyService.fetchFamily(parseInt(familyId, 10));

    return res.json({
      success: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};
