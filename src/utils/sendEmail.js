// import nodemailer from 'nodemailer';
// import 'dotenv/config';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
// import createHttpError from 'http-errors';
// import nodemailer from 'nodemailer';
// // import 'dotenv/config';
// import createHttpError from 'http-errors';

import nodemailer from 'nodemailer';
import 'dotenv/config';
import createHttpError from 'http-errors';
import { verifyToken } from './jwt.js';

const { SMTP_PASSWORD, SMTP_FROM } = process.env;

if (!SMTP_FROM || !SMTP_PASSWORD) {
  throw new Error('SMTP credentials are missing');
}

const nodemailerConfig = {
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false, // Виправлено на false для TLS
  auth: {
    user: SMTP_FROM,
    pass: SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // Додаємо для певних серверів
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data) => {
  const email = { ...data, from: SMTP_FROM };
  try {
    const info = await transport.sendMail(email);
    console.log('Email sent successfully:', info);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw createHttpError(500, `Error sending email: ${error.message}`);
  }
};

//  Логування для перевірки змінних оточення
console.log('SMTP_FROM:', SMTP_FROM);
console.log('SMTP_PASSWORD:', SMTP_PASSWORD);

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

// //  Логування для перевірки змінних оточення
// console.log('SMTP_FROM:', SMTP_FROM);
// console.log('SMTP_PASSWORD:', SMTP_PASSWORD);
// export default sendEmail;
