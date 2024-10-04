import * as authServices from '../services/auth.js';

// import { requestResetToken } from '../services/auth.js';

// import { resetPassword } from '../services/auth.js';
import { validateBody } from '../utils/validateBody.js';

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

export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authServices.verify(token);

  res.json({
    status: 200,
    message: 'Email verified successfully',
    data: {},
  });
};

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

export const sendResetEmailController = async (req, res, next) => {
  // Викликаємо функцію для генерації токена та надсилання листа
  await authServices.requestResetToken(req.body.email);
  // Відповідь у разі успіху
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await authServices.resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
