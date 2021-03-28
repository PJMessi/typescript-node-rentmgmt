import { NextFunction, Request, Response } from 'express';
import roomService from '@services/room/room.service';

export default {
  /**
   * Creates new room.
   * @route POST /rooms
   */
  createRoom: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const reqBody: {
        name: string;
        description?: string;
        price: number;
      } = req.body;

      const room = await roomService.createRoom(reqBody);

      return res.json({
        success: true,
        data: { room },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Fetches all the rooms with the current family if any.
   * @route GET /rooms
   */
  fetchAllRooms: async (
    _: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const rooms = await roomService.fetchAllRooms();
      return res.json({
        success: true,
        data: { rooms },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Fetches the room with the given id along with the room history.
   * @route GET /rooms/:roomId
   */
  fetchRoom: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const { roomId } = req.params;

      const room = await roomService.fetchRoom(parseInt(roomId, 10));

      return res.json({
        success: true,
        data: { room },
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * Adds new family to the room.
   * @route POST /rooms/:roomId/families
   */
  addFamily: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> => {
    try {
      const familyId = parseInt(req.params.roomId, 10);
      const requestBody: {
        name: string;
        sourceOfIncome: string;
        membersList: {
          name: string;
          email?: string;
          mobile?: string;
          birthDay: Date;
        }[];
      } = req.body;

      const family = await roomService.addFamily({
        familyId,
        familyAttributes: requestBody,
      });

      return res.json({
        success: true,
        data: { family },
      });
    } catch (error) {
      return next(error);
    }
  },
};
