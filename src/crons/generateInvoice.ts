import cron from 'node-cron';
import { Family, Invoice } from '@models/index';
import moment from 'moment';
import { generateInvoice } from '@root/services/invoice/invoice.service';
import { Op } from 'sequelize';
import logger from '@helpers/logging/logging.helper';
import sequelizeInstance from '@root/database/connection';

/** Generates invoice for the family every minute. */
cron.schedule('* * * * *', async () => {
  try {
    logger.info(`CRON: Generating invoice for the families.`);

    const firstDayOfMonth = moment().startOf('month').toDate();
    const lastDayOfMonth = moment().endOf('month').toDate();

    const families = await Family.findAll({
      include: [
        {
          association: 'histories',
          paranoid: false,
          where: {
            createdAt: {
              [Op.gt]: firstDayOfMonth,
              [Op.lt]: lastDayOfMonth,
            },
          },
          required: false,
        },
      ],
    });

    const transaction = await sequelizeInstance.transaction();
    const invoices: Invoice[] = [];
    try {
      families.forEach(async (family) => {
        const invoice = await generateInvoice(family, transaction);
        invoices.push(invoice);
        logger.info(`CRON: Generated invoice for the family: ${family.id}`);
      });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    logger.info('CRON: Successfully generated invoices for the families.');

    invoices.forEach((invoice) => {
      // send email.
    });
    logger.info('CRON: Invoice sent to the family members.');
  } catch (error) {
    logger.error('CRON: Failed to generate invoice for the families.');
  }
});
