import cron from 'node-cron';
import { generateInvoice } from '@services/invoice/invoice.service';
import { Family, Invoice } from '@root/database/models';
import sequelizeInstance from '@root/database/connection';
import logger from '@helpers/logging/logging.helper';
import InvoiceEmail from '@root/email/invoiceEmail/invoiceEmail';

/** Sends invoice email to all the members of the family of the invoice. */
const sendInvoiceEmails = (invoices: Invoice[]) => {
  invoices.forEach((invoice) => {
    const invoiceEmail = new InvoiceEmail(invoice);
    invoiceEmail.sendMail().catch((err) => {
      logger.error(`CRON: Error while sending emails.\n${err.stack}`);
    });
  });
};

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

    sendInvoiceEmails(invoices);

    logger.info('CRON: Invoice emails queued successfully.');
  } catch (error) {
    logger.error(`CRON: Failed to generate invoices.'\n${error}'`);
  }
});
