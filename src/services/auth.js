import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

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

export const signup = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });
  if (user) {
    throw createHttpError(409, 'Email already exist');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const data = await UserCollection.create({
    ...payload,
    password: hashPassword,
  });
  delete data._doc.password;

  return data._doc;
};
// export const signup = async (payload) => {
//   const { email, password } = payload;
//   Перевірка, чи існує користувач з таким email
//   const user = await UserCollection.findOne({ email });
//    Якщо користувач існує, викидаємо помилку
//   if (user) {
//     throw createHttpError(409, 'Email already exists');
//   }
//    Хешуємо пароль
//   const hashedPassword = await bcrypt.hash(password, 10);
//   Створюємо нового користувача
//   const data = await UserCollection.create({
//     ...payload,
//     password: hashedPassword,
//   });
//   Видаляємо пароль перед тим, як повертати дані
//   const { password: _, ...userData } = data._doc; // Видаляємо поле password з результату
//   return userData; // Повертаємо дані користувача без паролю
// };

export const signin = async (payload) => {
  const { email, password } = payload;
  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'Email or password  invalid');
  }
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
    // accessToken,
    // refreshToken,
    // accessTokenValidUntil,
    // refreshTokenValidUntil,
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

export const signout = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const findUser = (filter) => UserCollection.findOne(filter);
