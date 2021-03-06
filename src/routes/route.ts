import { Request, Response, Router } from 'express';
import userRoutes from './authentication.route';
import roomRoutes from './room.route';

const route = Router();

route.get('/', (req: Request, res: Response) => {
  return res.json({
    status: true,
    messsage: 'APIs are working fine.',
  });
});

route.use('/auth', userRoutes);
route.use('/rooms', roomRoutes);

export default route;