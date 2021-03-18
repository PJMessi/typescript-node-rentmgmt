import { Family, Invoice, Member } from '@models/index';
import sendInvoiceEmail from '@root/helpers/email/invoiceEmail/invoiceEmail';
import moment from 'moment';
import { Transaction } from 'sequelize/types';

/** Generates invioce for the given family. */
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Sends invoice email to all the members of the given family. */
export const sendInvoiceEmailToFamily = async (invoice: Invoice) => {
  await sleep(10000);
  console.log('Here------------------------>');

  const members = await Member.findAll({
    where: { familyId: invoice.familyId },
  });

  members.forEach((member) => {
    sendInvoiceEmail(member);
  });
};
