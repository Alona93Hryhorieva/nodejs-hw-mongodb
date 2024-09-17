import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import UserCollection from '../db/models/User.js';

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
};
