import { Request, Response, Router } from 'express';
import userRoutes from './authentication.route';

const route = Router();

route.get('/', (req: Request, res: Response) => {
  return res.json({
    status: true,
    messsage: 'APIs are working fine.',
  });
});

route.use('/auth', userRoutes);

export default route;
