import { NextFunction, Request, Response } from 'express';
import invoiceService from '@services/invoice/invoice.service';

/**
 * GET /invoices
 * Fetches the list of invoices along with the family information.
 */
export const fetchInvoices = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void | Response> => {
  try {
    const invoices = await invoiceService.fetchInvoices();

    return res.json({
      success: true,
      data: { invoices },
    });
  } catch (error) {
    return next(error);
  }
};

/**
 * PUT /invoices/:invoiceId/status
 * Updates the status of the invoice.
 */
export const updateInvoiceStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invoiceId = parseInt(req.params.invoiceId, 10);
    const { status } = req.body;

    const invoice = await invoiceService.updateInvoiceStatus(invoiceId, status);

    return res.json({
      success: true,
      data: { invoice },
    });
  } catch (error) {
    return next(error);
  }
};
