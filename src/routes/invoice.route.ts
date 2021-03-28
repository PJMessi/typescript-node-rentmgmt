import { Router } from 'express';
import invoiceController from '@controllers/invoices/invoice.controller';
import invoiceApiValidator from '@controllers/invoices/invoice.validation';
import authMiddleware from '@middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, invoiceController.fetchInvoices);
router.put(
  '/:invoiceId/status',
  authMiddleware,
  invoiceApiValidator.validateForUpdateInvoiceStatus,
  invoiceController.updateInvoiceStatus
);

export default router;
