import * as authServices from '../services/auth.js';

export const signupController = async (req, res) => {
  const newUser = await authServices.signup(req.body);

  res.status(201).json({
    status: 201,
    message: 'Succsessfully register user',
    data: newUser,
  });
};

export const signinController = async (req, res) => {
  const session = await authServices.signin(req.body);

  const refreshTokenExpiry = new Date(session.refreshTokenValidUntil);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    // expires: new Date(Date.now() + session.refreshTokenValidUntil),
    expires: refreshTokenExpiry,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    // expires: new Date(Date.now() + session.refreshTokenValidUntil),
    expires: refreshTokenExpiry,
  });

  res.json({
    status: 200,
    message: 'Successfully signin',
    data: {
      accessToken: session.accessToken,
    },
    // refreshToken: session.refreshToken,
  });
};

// export const refreshController = async (req, res) => {
//   const { refreshToken, sessionId } = req.cookies;
//   const session = await authServices.refreshSession({
//     refreshToken,
//     sessionId,
//   });

//   setupSession(res, session);

//   res.json({
//     status: 200,
//     message: 'Successfully refresh session',
//     data: {
//       accessToken: session.accessToken,
//     },
//   });
// };

// export const signoutController = async (req, res) => {
//   const { sessionId } = req.cookies;
//   if (sessionId) {
//     await authServices.signout(sessionId);
//   }

//   res.clearCookie('sessionId');
//   res.clearCookie('refreshToken');

//   res.status(204).send();
// };

/*жпт
const createHttpError = require('http-errors');
const { registerUser } = require('../services/auth');

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Валідація обов'язкових полів
    if (!name || !email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    // Реєстрація користувача через сервіс
    const newUser = await registerUser({ name, email, password });

    // Формування відповіді без поля пароля
    const { password: _, ...userData } = newUser._doc;

    res.status(201).json({
      status: 'success',
      message: 'Successfully registered a user!',
      data: userData,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
};


const createHttpError = require('http-errors');
const { loginUser } = require('../services/auth');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Валідація обов'язкових полів
    if (!email || !password) {
      throw createHttpError(400, 'Missing required fields');
    }

    // Аутентифікація користувача
    const { accessToken, refreshToken } = await loginUser({ email, password });

    // Встановлення refresh токена в cookies
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 днів
    });

    res.status(200).json({
      status: 'success',
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login, // Додаємо новий контролер для логіну
};

*/
