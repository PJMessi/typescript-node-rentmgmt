import { NextFunction, Request, Response, Router } from 'express';
import sendWelcomeEmail from '@root/helpers/email/welcomeEmail/welcomeEmail';
import { Member } from '@root/database/models';

const router = Router();

const testFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const member = await Member.findOne();
    if (member === null) throw new Error();

    sendWelcomeEmail(member);

    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

router.use('/', testFunction);

export default router;
