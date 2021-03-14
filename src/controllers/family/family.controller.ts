import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

/**
 * POST /families/:familyId/rooms/:roomId/change
 * Changes the room for the given family.
 */
export const changeRoom = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const { roomId, familyId } = req.params;

    const family = await familyService.changeRoom(
      parseInt(familyId, 10),
      parseInt(roomId, 10)
    );

    return res.json({
      success: true,
      data: { family },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * POST /families/:familyId
 * Fetches the Room with given id along with the information about the room they
 * are using and the family members.
 */
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
