import { Router } from 'express';
import {
  fetchInvoices,
  updateInvoiceStatus,
} from '@controllers/invoices/invoice.controller';
import { validateForUpdateInvoiceStatus } from '@controllers/invoices/invoice.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, fetchInvoices);
router.put(
  '/:invoiceId/status',
  authMiddleware,
  validateForUpdateInvoiceStatus,
  updateInvoiceStatus
);

export default router;
