import { Family, Invoice, RoomFamilyHistory } from '@root/database/models';
import moment from 'moment';
import { Op, Transaction } from 'sequelize';

const firstDayOfMonth = moment().startOf('month').toDate();
const lastDayOfMonth = moment().endOf('month').toDate();

/** Calculates the total amount (with details) based on the given histories for creating invoice. */
export const getAmountDetails = (
  histories: RoomFamilyHistory[]
): GetAmountDetailsParams => {
  let amount = 0;
  const amountDetails: typeof Invoice.prototype.amountDetails = [];

  histories.forEach((history) => {
    const startDate =
      history.createdAt < firstDayOfMonth ? firstDayOfMonth : history.createdAt;
    const endDate = history.deletedAt || lastDayOfMonth;

    if (startDate >= firstDayOfMonth && endDate <= lastDayOfMonth) {
    }
    amount += history.amount;

    amountDetails.push({
      roomId: history.roomId,
      from: startDate,
      to: endDate,
      amount: history.amount,
    });
  });

  return { amount, amountDetails };
};

/** Generates invoice for the family. If the given family instance already contains the related histories,
 * that would be used to calculate amount. Else, it would be fetched from the database. */
export const generateInvoice = async (
  family: Family,
  transaction?: Transaction
) => {
  let roomFamilyHistory = family.histories;

  if (!roomFamilyHistory) {
    roomFamilyHistory = await family.getHistories({
      where: {
        createdAt: {
          [Op.gt]: firstDayOfMonth,
          [Op.lt]: lastDayOfMonth,
        },
      },
      paranoid: false,
      order: [['id', 'DESC']],
    });
  }

  const { amount, amountDetails } = getAmountDetails(roomFamilyHistory);
  const invoice = await Invoice.create(
    {
      familyId: family.id,
      amount,
      amountDetails,
    },
    { transaction }
  );

  return invoice;
};

export default { generateInvoice };

type GetAmountDetailsParams = {
  amount: number;
  amountDetails: typeof Invoice.prototype.amountDetails;
};
