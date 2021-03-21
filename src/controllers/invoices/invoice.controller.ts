import { NextFunction, Request, Response } from 'express';
import invoiceService from '@services/invoice/invoice.service';

/**
 * GET /invoices
 * Fetches the list of invoices along with the family information.
 */
// eslint-disable-next-line import/prefer-default-export
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
