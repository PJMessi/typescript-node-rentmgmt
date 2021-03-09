import { Room } from '@root/database/models/room.model';
import { RoomFamilyHistory } from '@root/database/models/roomfamilyhistory.model';
import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

const testFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const history = await RoomFamilyHistory.findAll();
    console.log(history);
    const room = await Room.findOne({ include: 'families' });

    if (!room) {
      return res.status(500).json({
        status: false,
        message: 'No room.',
      });
    }

    const data = room.families;
    console.log(data);

    return res.json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

router.use('/', testFunction);

export default router;
