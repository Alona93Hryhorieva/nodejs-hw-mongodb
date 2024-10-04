import nodemailer from 'nodemailer';
import 'dotenv/config';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
import createHttpError from 'http-errors';

// console.log('SMTP_HOST:', env(SMTP.SMTP_HOST));
// console.log('SMTP_PORT:', env(SMTP.SMTP_PORT));
// console.log('SMTP_USER:', env(SMTP.SMTP_USER));
// console.log('SMTP_PASSWORD:', env(SMTP.SMTP_PASSWORD));

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // для TLS
  auth: {
    user: env(SMTP.SMTP_USER), // або з process.env безпосередньо
    pass: env(SMTP.SMTP_PASSWORD),
  },
  tls: {
    rejectUnauthorized: false, // Додається, якщо проблема з сертифікатом
  },
});

export const sendEmail = async (options) => {
  try {
    // console.log('Attempting to send email with options:', options);
    const info = await transporter.sendMail(options);
    // console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    // console.error('Failed to send email:', error.message);
    if (error.response) {
      // console.error('SMTP Server Response:', error.response);
    }
    throw createHttpError(500, `Error sending email: ${error.message}`);
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
