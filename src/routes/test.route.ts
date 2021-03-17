import { NextFunction, Request, Response, Router } from 'express';

const router = Router();

const testFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

router.use('/', testFunction);

export default router;
