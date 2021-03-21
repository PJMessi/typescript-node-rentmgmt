import cron from 'node-cron';
import { generateInvoice } from '@services/invoice/invoice.service';
import { Family, Invoice } from '@root/database/models';
import sequelizeInstance from '@root/database/connection';
import logger from '@helpers/logging/logging.helper';
import InvoiceEmail from '@root/email/invoiceEmail/invoiceEmail';
import moment from 'moment';

/** Sends invoice email to all the members of the family of the invoice. */
const sendInvoiceEmails = (invoices: Invoice[]) => {
  invoices.forEach((invoice) => {
    const invoiceEmail = new InvoiceEmail(invoice);
    invoiceEmail.sendMail().catch((err) => {
      logger.error(`CRON: Error while sending emails.\n${err.stack}`);
    });
  });
};

/** Determines if the invoice should be generated for the family. If the invoice is already generated
 * for the family in this month, it should not be generated. */
const shouldGenerate = async (family: Family): Promise<boolean> => {
  let latestInvoices = family.invoices;

  if (!latestInvoices)
    // eslint-disable-next-line no-await-in-loop
    latestInvoices = await family.getInvoices({
      order: [['id', 'DESC']],
      limit: 1,
    });

  return (
    !latestInvoices[0] ||
    latestInvoices[0].createdAt < moment().startOf('month').toDate()
  );
};

/** Generates the invoice for the given families. */
const generateInvoices = async (families: Family[]): Promise<Invoice[]> => {
  const invoices: Invoice[] = [];

  const transaction = await sequelizeInstance.transaction();
  try {
    // eslint-disable-next-line no-restricted-syntax
    for (const family of families) {
      // eslint-disable-next-line no-await-in-loop
      const shouldGenerateInvoice = await shouldGenerate(family);

      if (shouldGenerateInvoice) {
        // eslint-disable-next-line no-await-in-loop
        const invoice = await generateInvoice(family, transaction);
        logger.info(`CRON: Invoice generated for family: ${family.id}.`);
        invoices.push(invoice);
      }
    }

    await transaction.commit();

    return invoices;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

/** Generates invoice for the family at 26th of every month. */
cron.schedule('0 0 26 * *', async () => {
  try {
    logger.info('CRON: Generating invoices.');

    const families = await Family.findAll({
      include: [{ association: 'invoices', order: [['id', 'DESC']], limit: 1 }],
    });

    const invoices = await generateInvoices(families);

    logger.info('CRON: Invoices generated successfully.');

    sendInvoiceEmails(invoices);

    logger.info('CRON: Invoice emails queued successfully.');
  } catch (error) {
    logger.error(`CRON: Failed to generate invoices.'\n${error}'`);
  }
});
