import { Member } from '@root/database/models';
import { MailOptions } from 'nodemailer/lib/json-transport';
import path from 'path';
import logger from '@helpers/logging/logging.helper';
import Email from '../email';

class Welcome extends Email {
  member: Member;

  constructor(member: Member) {
    super();
    this.member = member;
  }

  async mailOptions(): Promise<MailOptions> {
    if (this.member.email === null)
      throw new Error(
        `Member '${this.member.id}' does not have an email address.`
      );

    const templateFileLocation = path.join(
      __dirname,
      'welcomeEmailTemplate.handlebars'
    );

    const html = this.generateEmailTemplate(templateFileLocation, {
      member: this.member.toJSON(),
    });

    const emailPngPath = `${path.join(__dirname, '../../public')}/email.png`;

    return {
      from: 'info@rentmag.com',
      to: this.member.email,
      subject: 'Welcome',
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
        `Welcome email sent to '${this.member.email}'\n${JSON.stringify(
          emailResponse
        )}`
      );
    } catch (error) {
      logger.error(
        `Failed to send welcome email to '${this.member.email}'\n${error}'`
      );
    }
  }
}

export default Welcome;
