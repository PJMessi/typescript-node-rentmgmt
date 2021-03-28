import { NextFunction, Request, Response } from 'express';
import familyService from '@services/family/family.service';

export default {
  /**
   * Fetches the Room with given id along with the information about the room they
   * are using and the family members.
   * @route POST /families/:familyId
   */
  fetchFamily: async (
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
  },

  /**
   * Fetches the list of all the rooms along with their room information.
   * @route POST /families
   */
  fetchFamilies: async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const families = await familyService.fetchFamilies();

      return res.json({
        success: true,
        data: { families },
      });
    } catch (error) {
      return next(error);
    }
  },
};
