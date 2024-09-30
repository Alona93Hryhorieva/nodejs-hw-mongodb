import nodemailer from 'nodemailer';
import 'dotenv/config';

const { SMTP_PASSWORD, SMTP_FROM } = process.env;

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

const sendEmail = (data) => {
  const email = { ...data, from: SMTP_FROM };
  return transport.sendMail(email);
};

// Логування для перевірки змінних оточення
// console.log('SMTP_FROM:', SMTP_FROM);
// console.log('SMTP_PASSWORD:', SMTP_PASSWORD);

export default sendEmail;
