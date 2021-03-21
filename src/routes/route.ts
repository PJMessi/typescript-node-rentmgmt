import { Request, Response, Router } from 'express';
import userRoutes from './authentication.route';
import roomRoutes from './room.route';
import familyRoutes from './family.route';
import testRoutes from './test.route';
import invoiceRoutes from './invoice.route';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  return res.json({
    status: true,
    messsage: 'APIs are working fine.',
  });
});

router.use('/auth', userRoutes);
router.use('/rooms', roomRoutes);
router.use('/families', familyRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/test', testRoutes);

export default router;
