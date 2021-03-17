import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { Member } from '@root/database/models';
import logger from '@helpers/logging/logging.helper';
import transporter from '../index';

const sendWelcomeEmail = (member: Member): void => {
  if (process.env.NODE_ENV === 'test') return;
  if (member.email === null) return;

  const templateFile = fs.readFileSync(
    path.join(__dirname, 'welcomeEmailTemplate.handlebars'),
    'utf8'
  );

  const compiledHtml = handlebars.compile(templateFile);

  const message = {
    from: 'info@rentmag.com',
    to: member.email,
    subject: 'Welcome',
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
        `Failed to send welcome email to '${member.email}'\n${err}'`
      );
    }
    if (info) {
      logger.info(
        `Welcome email sent to '${member.email}'\n${JSON.stringify(info)}`
      );
    }
  });
};

export default sendWelcomeEmail;
