import { Family, Invoice } from '@root/database/models';
import { MailOptions } from 'nodemailer/lib/sendmail-transport';
import path from 'path';
import logger from '@helpers/logging/logging.helper';
import Email from '../email';

class InvoiceEmail extends Email {
  invoice: Invoice;

  constructor(invoice: Invoice) {
    super();
    this.invoice = invoice;
  }

  // eslint-disable-next-line class-methods-use-this
  async prepareRecipients(family: Family) {
    let { members } = family;
    if (!members) members = await family.getMembers();

    let recipients = '';
    members.forEach((member) => {
      if (member.email) recipients += `${member.email}, `;
    });

    if (recipients !== '') recipients = recipients.slice(0, -2);

    return recipients;
  }

  async mailOptions(): Promise<MailOptions> {
    await this.invoice.reload({
      include: {
        association: 'family',
        include: ['members'],
      },
    });

    const family = this.invoice.family!;

    const recipients = await this.prepareRecipients(family);

    const emailPngPath = `${path.join(__dirname, '../../public')}/email.png`;

    const templateFileLocation = path.join(
      __dirname,
      'invoiceEmailTemplate.handlebars'
    );

    const html = this.generateEmailTemplate(templateFileLocation, {
      invoice: this.invoice.toJSON(),
    });

    return {
      from: 'info@rentmag.com',
      to: recipients,
      subject: 'Invoice',
      attachments: [
        {
          filename: 'email.png',
          path: emailPngPath,
          cid: 'emailPng',
        },
      ],
      html,
    };
  }

  async sendMail() {
    try {
      const emailResponse = await super.sendMail();
      logger.info(
        `Invoice email sent to all the members of '${
          this.invoice.family!.name
        }'\n${JSON.stringify(emailResponse)}`
      );
    } catch (error) {
      logger.error(
        `Failed to send invoice email to the members of '${
          this.invoice.family!.name
        }'\n${error}'`
      );
    }
  }
}

export default InvoiceEmail;
