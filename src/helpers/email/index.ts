import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'af229ee2e7ee76',
    pass: 'a5aa748fc18a3f',
  },
});

export default transporter;
