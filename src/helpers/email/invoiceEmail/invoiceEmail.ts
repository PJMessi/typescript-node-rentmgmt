import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Member } from '@root/database/models';
import logger from '@helpers/logging/logging.helper';
import transporter from '../index';

const sendInvoiceEmail = (member: Member): void => {
  if (process.env.NODE_ENV === 'test') return;
  if (member.email === null) return;

  const templateFile = fs.readFileSync(
    path.join(__dirname, 'invoiceEmailTemplate.handlebars'),
    'utf8'
  );

  const compiledHtml = handlebars.compile(templateFile);

  const message = {
    from: 'info@rentmag.com',
    to: member.email,
    subject: 'Invoice',
    attachments: [
      {
        filename: 'email.png',
        path: `${path.join(__dirname, '../../../public')}/email.png`,
        cid: 'emailPng',
      },
    ],
    html: compiledHtml({
      member: member.toJSON(),
    }),
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      logger.error(
        `Failed to send invoice email to '${member.email}'\n${err}'`
      );
    }
    if (info) {
      logger.info(
        `Invoice email sent to '${member.email}'\n${JSON.stringify(info)}`
      );
    }
  });
};

export default sendInvoiceEmail;
