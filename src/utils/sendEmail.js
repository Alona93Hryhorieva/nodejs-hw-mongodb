import nodemailer from 'nodemailer';
import 'dotenv/config';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  secure: false, // False для TLS (587)
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
  tls: {
    rejectUnauthorized: false, // Якщо проблема з сертифікатом
  },
});

console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD);

// export const sendEmail = async (options) => {
//   return await transporter.sendMail(options);
// };
export const sendEmail = async (options) => {
  try {
    const info = await transporter.sendMail(options);
    console.log('Email sent:', info.response);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export default sendEmail;

// ВАРІАНТ ВИКЛАДАЧА З ВЕРИФІКАЦІЄЮ
// const { SMTP_PASSWORD, SMTP_FROM } = process.env;

// const nodemailerConfig = {
//   host: 'smtp-relay.brevo.com',
//   port: 587,
//   secure: false, // Виправлено на false для TLS
//   auth: {
//     user: SMTP_FROM,
//     pass: SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false, // Додаємо для певних серверів
//   },
// };

// const transport = nodemailer.createTransport(nodemailerConfig);

// const sendEmail = (data) => {
//   const email = { ...data, from: SMTP_FROM };
//   return transport.sendMail(email);
// };

//  Логування для перевірки змінних оточення
// // console.log('SMTP_FROM:', SMTP_FROM);
// // console.log('SMTP_PASSWORD:', SMTP_PASSWORD);
