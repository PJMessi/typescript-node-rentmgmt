import { Router } from 'express';
import { fetchInvoices } from '@controllers/invoices/invoice.controller';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, fetchInvoices);

export default router;
