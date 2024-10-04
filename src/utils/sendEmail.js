// ВАРІАНТ ВИКЛАДАЧА З ВЕРИФІКАЦІЄЮ
// import nodemailer from 'nodemailer';
// import { SMTP } from '../constants/index.js';
// import { env } from '../utils/env.js';

// const { SMTP_PASSWORD, SMTP_FROM } = process.env;

// const nodemailerConfig = {
//   host: env(SMTP.SMTP_HOST),
//   port: Number(env(SMTP.SMTP_PORT)),
//   secure: false, // Виправлено на false для TLS
//   auth: {
//     user: env(SMTP.SMTP_USER),
//     pass: env(SMTP.SMTP_PASSWORD),
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
// export default sendEmail;

import nodemailer from 'nodemailer';
import { SMTP } from '../constants/index.js';
import { env } from '../utils/env.js';
const transporter = nodemailer.createTransport({
  host: env(SMTP.SMTP_HOST),
  port: Number(env(SMTP.SMTP_PORT)),
  auth: {
    user: env(SMTP.SMTP_USER),
    pass: env(SMTP.SMTP_PASSWORD),
  },
});
export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};
