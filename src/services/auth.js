import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import jwt from 'jsonwebtoken';

import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';
import { SMTP } from '../constants/index.js';
// import { createJwtToken } from '../utils/jwt.js';
import { env } from '../utils/env.js';
import sendEmail from '../utils/sendEmail.js';
import { TEMPLATES_DIR } from '../constants/index.js';

// const verifyEmailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');шлях до шаблону

// const verifyEmailTemplateSource = await fs.readFile(
//   verifyEmailTemplatePath,
//   'utf-8',
// );ЗМІСТ ШАБЛОНУ-ЗАГОТОВКА

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

const appDomain = env('APP_DOMAIN'); //адреса бекенду
// console.log(appDomain);

export const register = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });

  delete data._doc.password; // Видаляємо пароль з відповіді

  // const jwtToken = createJwtToken({ email });
  // const template = handlebars.compile(verifyEmailTemplateSource);
  // const html = template({
  //   appDomain,
  //   jwtToken,
  // });СТВОРЕННЯ ШАБЛОНУ
  //  Логіка відправлення листа
  // const verifyEmail = {
  //   to: email,
  //   subject: 'Verify email',
  //   html: `<a target="_blank" href="${appDomain}/auth/verify?token=${jwtToken}">Click verify email</a>`,
  // };
  // await sendEmail(verifyEmail);

  return data;
};

// export const verify = async (token) => {
//   const { data, error } = verifyToken(token);
//   if (error) {
//     throw createHttpError(401, 'Token invalid');
//   }
// console.log(data);

//   const user = await UserCollection.findOne({ email: data.email });
// console.log(data);
//   if (user.verify) {
//     throw createHttpError(401, 'Email already verify');
//   }

//   await UserCollection.findOneAndUpdate({ _id: user._id }, { verify: true });
// };

export const login = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password  invalid');
  }

  // if (!user.verify) {
  //   throw createHttpError(401, 'Email not verify');
  // }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw createHttpError(401, 'Email or password  invalid');
  }

  await SessionCollection.deleteOne({
    userId: user._id,
  });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: user._id,
    ...sessionData,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

export const refreshSession = async ({ refreshToken, sessionId }) => {
  const oldSession = await SessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!oldSession) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: sessionId });

  const sessionData = createSession();

  const userSession = await SessionCollection.create({
    userId: oldSession._id,
    ...sessionData,
  });

  return userSession;
};

export const logout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => UserCollection.findOne(filter);

export const requestResetToken = async (email) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  // Створюємо JWT токен
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    { expiresIn: '15m' },
  );

  // Читання шаблону
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource.toString());

  // Створення HTML контенту листа
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`, // Формуємо посилання
  });

  // Відправка листа
  await sendEmail({
    from: env(SMTP.SMTP_FROM),
    to: email,
    subject: 'Reset your password',
    html,
  });
};

export const resetPassword = async (payload) => {
  // const entries = verifyToken(payload.token);

  entries = jwt.verify(payload.token, env('JWT_SECRET'));

  const user = await UserCollection.findOne({
    email: entries.data.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UserCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );

  await SessionCollection.deleteOne({ userId: user._id });
};
