import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import UserCollection from '../db/models/User.js';
import SessionCollection from '../db/models/Session.js';
import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/users.js';

// const createSession = () => {
//   const accessToken = randomBytes(30).toString('base64');
//   const refreshToken = randomBytes(30).toString('base64');
//   const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
//   const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

//   return {
//     accessToken,
//     refreshToken,
//     accessTokenValidUntil,
//     refreshTokenValidUntil,
//   };
// };

export const signup = async (payload) => {
  const { email, password } = payload;

  const user = await UserCollection.findOne({ email });

  if (!user) {
    throw createHttpError(409, 'Email already exist');
  }

  const hasPassword = await bcrypt.hash(password, 10);
  const data = await UserCollection.create({
    ...payload,
    password: hasPassword,
  });
  //   console.log(data._doc);
  delete data._doc.password;

  return data._doc;
};

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

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const accessTokenValidUntil = new Date(Date.now() + accessTokenLifetime);
  const refreshTokenValidUntil = new Date(Date.now() + refreshTokenLifetime);

  const userSession = await SessionCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return userSession;
};

export const findSessionByAccessToken = (accessToken) =>
  SessionCollection.findOne({ accessToken });

// export const refreshSession = async ({ refreshToken, sessionId }) => {
//   const oldSession = await SessionCollection.findOne({
//     _id: sessionId,
//     refreshToken,
//   });

//   if (!oldSession) {
//     throw createHttpError(401, 'Session not found');
//   }

//   if (new Date() > oldSession.refreshTokenValidUntil) {
//     throw createHttpError(401, 'Session token expired');
//   }

//   await SessionCollection.deleteOne({ _id: sessionId });

//   const sessionData = createSession();

//   const userSession = await SessionCollection.create({
//     userId: oldSession._id,
//     ...sessionData,
//   });

//   return userSession;
// };

// export const signout = async (sessionId) => {
//   await SessionCollection.deleteOne({ _id: sessionId });
// };

export const findUser = (filter) => UserCollection.findOne(filter);

/*жпт
const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const User = require('../models/User'); // Передбачено, що модель User знаходиться в цій директорії

const registerUser = async ({ name, email, password }) => {
  // Перевірка, чи існує користувач із такою поштою
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(409, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення нового користувача
  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Збереження користувача в базі даних
  await newUser.save();

  return newUser;
};

module.exports = {
  registerUser,
};


const bcrypt = require('bcrypt');
const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Модель користувача

const loginUser = async ({ email, password }) => {
  // Знаходження користувача за email
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Перевірка пароля
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, 'Invalid email or password');
  }

  // Генерація токенів
  const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '30d',
  });

  // Видалення попередньої сесії (якщо є)
  await Session.findOneAndDelete({ userId: user._id });

  // Збереження нової сесії з refresh токеном
  const newSession = new Session({
    userId: user._id,
    refreshToken,
  });
  await newSession.save();

  return { accessToken, refreshToken };
};

module.exports = {
  registerUser,
  loginUser,
};

*/
