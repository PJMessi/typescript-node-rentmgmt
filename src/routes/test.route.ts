import { NextFunction, Request, Response, Router } from 'express';
import axios from 'axios';

const router = Router();

const testFunction1 = () => {
  axios('https://jsonplaceholder.typicode.com/todos/1')
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
};

const testFunction = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    console.log('before');
    testFunction1();
    console.log('after');
    return res.json({
      success: true,
    });
  } catch (error) {
    return next(error);
  }
};

router.use('/', testFunction);

export default router;
