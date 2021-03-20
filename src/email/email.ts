import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';

abstract class Email {
  transporter: Mail = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    secure: false,
    auth: {
      user: 'af229ee2e7ee76',
      pass: 'a5aa748fc18a3f',
    },
  });

  /** Returns the mail options for the email. */
  abstract mailOptions(): Promise<MailOptions>;

  /** Compiles the handlebars template with the given data and returns.  */
  // eslint-disable-next-line class-methods-use-this
  public generateEmailTemplate(
    templateFileLocation: string,
    templateData: object
  ): string {
    const templateFile = fs.readFileSync(templateFileLocation, 'utf8');
    const template = handlebars.compile(templateFile);
    const html = template(templateData);
    return html;
  }

  /** Sends the email and returns the success/error response in promise. */
  async sendMail() {
    const mailOptions = await this.mailOptions();

    return new Promise((resolve, reject) => {
      this.transporter
        .sendMail(mailOptions)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default Email;
