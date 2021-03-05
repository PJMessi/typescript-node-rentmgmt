import { Request, Response, Router } from 'express';
import userRoutes from './userRoute';

const route = Router();

route.use('/sss', (req: Request, res: Response) => {
  return res.json({
    status: true,
    messsage: 'APIs are working fine.',
  });
});

route.use('/auth', userRoutes);

export default route;
