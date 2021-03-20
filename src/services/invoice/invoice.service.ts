import { Family, Invoice } from '@models/index';
import moment from 'moment';
import { Transaction } from 'sequelize/types';

/** Generates invoice for the given family. */
// eslint-disable-next-line import/prefer-default-export
export const generateInvoice = async (
  family: Family,
  transaction?: Transaction
): Promise<Invoice> => {
  const startOfTheMonth = moment().clone().startOf('month').toDate();
  const endOfTheMonth = moment().clone().endOf('month').toDate();

  let totalAmount: number;
  let startDate: Date;

  if (family.createdAt < startOfTheMonth) {
    totalAmount = family.amount;
    startDate = startOfTheMonth;
  } else {
    const amountPerDay = family.amount / 30;
    const rentedDaysInThisMonth = Math.abs(
      moment
        .duration(moment(family.createdAt).diff(moment(endOfTheMonth)))
        .asDays()
    );

    totalAmount = amountPerDay * rentedDaysInThisMonth;
    startDate = family.createdAt;
  }

  const invoice = await Invoice.create(
    {
      familyId: family.id,
      amount: totalAmount,
      startDate,
      endDate: endOfTheMonth,
    },
    { transaction }
  );

  return invoice;
};
