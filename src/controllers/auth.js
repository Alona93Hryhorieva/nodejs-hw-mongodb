import * as authServices from '../services/auth.js';

// import { requestResetToken } from '../services/auth.js';

// import { resetPassword } from '../services/auth.js';
import { validateBody } from '../utils/validateBody.js';
import { verifyToken } from '../utils/jwt.js';

const setupSession = (res, session) => {
  const refreshTokenExpiry = new Date(session.refreshTokenValidUntil); // Конвертуємо в дату

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: refreshTokenExpiry,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: refreshTokenExpiry,
  });
};

export const registerController = async (req, res) => {
  const newUser = await authServices.register(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: newUser,
  });
};

// export const verifyController = async (req, res) => {
//   const { token } = req.query;
//   await authServices.verify(token);

//   res.json({
//     status: 200,
//     message: 'Email verified successfully',
//     data: {},
//   });
// };

export const loginController = async (req, res) => {
  const session = await authServices.login(req.body);

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  // console.log(req.cookies);
  const { refreshToken, sessionId } = req.cookies;

  const session = await authServices.refreshSession({
    refreshToken,
    sessionId,
  });

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { sessionId } = req.cookies;

  if (sessionId) {
    await authServices.logout(sessionId);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');
  res.status(204).send();
};

// export const sendResetEmailController = async (req, res, next) => {
//   // Викликаємо функцію для генерації токена та надсилання листа
//   await authServices.requestResetToken(req.body.email);
//   // Відповідь у разі успіху
//   res.status(200).json({
//     status: 200,
//     message: 'Reset password email has been successfully sent.',
//     data: {},
//   });
// };
export const sendResetEmailController = async (req, res, next) => {
  const { email } = req.body; // Деструктуризація

  // Перевірка наявності email у запиті
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    // Викликаємо функцію для генерації токена та надсилання листа
    await authServices.requestResetToken(email);

    // Відповідь у разі успіху
    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (error) {
    // Обробка помилок
    next(error); // Передача помилки в обробник помилок
  }
};

// export const resetPasswordController = async (req, res) => {
//   await authServices.resetPassword(req.body);
//   res.json({
//     message: 'Password was successfully reset!',
//     status: 200,
//     data: {},
//   });
// };
export const resetPasswordController = async (req, res) => {
  // Отримуємо токен з заголовка авторизації
  const token = req.headers.authorization?.split(' ')[1]; // Додано "?." для обробки випадків, коли заголовок може бути відсутнім

  // Перевірка наявності токена
  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  const { password } = req.body; // Отримуємо новий пароль з тіла запиту

  // Перевіряємо токен
  const { data, error } = verifyToken(token); // Перевіряємо токен

  // Обробка помилок перевірки токена
  if (error) {
    return res.status(400).json({ message: 'Invalid token', error });
  }

  // Перевірка наявності електронної адреси в даних
  if (!data || !data.email) {
    return res.status(400).json({ message: 'Email not found in token.' });
  }

  try {
    // Виклик сервісу скидання пароля з електронною адресою та новим паролем
    await authServices.resetPassword({ email: data.email, password });
    res.json({
      message: 'Password was successfully reset!',
      status: 200,
      data: {},
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to reset password.', error: error.message });
  }
};
