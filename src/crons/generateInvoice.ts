import cron from 'node-cron';
import {
  generateInvoice,
  sendInvoiceEmailToFamily,
} from '@services/invoice/invoice.service';
import { Family, Invoice } from '@root/database/models';
import sequelizeInstance from '@root/database/connection';
import logger from '@helpers/logging/logging.helper';

/** Generates invoice for the family every minute. */
cron.schedule('* * * * *', async () => {
  try {
    logger.info('CRON: Generating invoices.');

    const families = await Family.findAll();

    const invoices: Invoice[] = [];
    const transaction = await sequelizeInstance.transaction();
    try {
      // eslint-disable-next-line no-restricted-syntax
      for (const family of families) {
        // eslint-disable-next-line no-await-in-loop
        const invoice = await generateInvoice(family, transaction);
        logger.info(`CRON: Invoice generated for family: ${family.id}.`);
        invoices.push(invoice);
      }

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
    logger.info('CRON: Invoices generated successfully.');

    invoices.forEach((invoice) => sendInvoiceEmailToFamily(invoice));
    logger.info('CRON: Invoice emails sent successfully.');
  } catch (error) {
    logger.error(`CRON: Failed to generate invoices.'\n${error}'`);
  }
});
