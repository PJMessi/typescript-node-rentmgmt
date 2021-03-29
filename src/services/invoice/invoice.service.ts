import { Family, Invoice } from '@models/index';
import moment from 'moment';
import { Transaction } from 'sequelize/types';
import createError from 'http-errors';

/** Calculates the total amount and date to generate invoice for the given family. */
const getAmtAndDateForInvoice = (
  family: Family
): {
  totalAmount: number;
  startDate: Date;
  endDate: Date;
} => {
  const startOfTheMonth = moment().clone().startOf('month').toDate();
  const endOfTheMonth = moment().clone().endOf('month').toDate();

  if (family.createdAt < startOfTheMonth) {
    return {
      totalAmount: family.amount,
      startDate: startOfTheMonth,
      endDate: endOfTheMonth,
    };
  }

  const amountPerDay = family.amount / 30;
  const rentedDaysInThisMonth = Math.abs(
    moment
      .duration(moment(family.createdAt).diff(moment(endOfTheMonth)))
      .asDays()
  );

  return {
    totalAmount: amountPerDay * rentedDaysInThisMonth,
    startDate: family.createdAt,
    endDate: endOfTheMonth,
  };
};

/** Generates invoice for the given family. */
export const generateInvoice = async (
  family: Family,
  transaction?: Transaction
): Promise<Invoice> => {
  const { totalAmount, startDate, endDate } = getAmtAndDateForInvoice(family);

  const invoice = await Invoice.create(
    {
      familyId: family.id,
      amount: totalAmount,
      startDate,
      endDate,
      status: 'PENDING',
    },
    { transaction }
  );

  return invoice;
};

/** Fetches all the invoices along with family information. */
export const fetchInvoices = async (): Promise<Invoice[]> => {
  const invoices = await Invoice.findAll({
    include: ['family'],
    order: [['id', 'DESC']],
  });

  return invoices;
};

/** Updates the payment status of the invoice. */
export const updateInvoiceStatus = async (
  invoiceId: number,
  status: typeof Invoice.prototype.status
): Promise<Invoice> => {
  const invoice = await Invoice.findByPk(invoiceId);

  if (invoice === null) throw new createError.NotFound('Invoice not found.');

  await invoice.update({ status });

  return invoice;
};

export default { generateInvoice, fetchInvoices, updateInvoiceStatus };
