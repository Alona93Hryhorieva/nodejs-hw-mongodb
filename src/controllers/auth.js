import * as authServices from '../services/auth.js';

import { requestResetToken } from '../services/auth.js';

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

// export const requestResetEmailController = async (req, res) => {
//   await requestResetToken(req.body.email);
//   res.json({
//     message: 'Reset password email was successfully sent!',
//     status: 200,
//     data: {},
//   });
// }; ВАРІАНТ КОНСПЕКТА
export const requestResetEmailController = async (req, res) => {
  try {
    await requestResetToken(req.body.email);
    res.json({
      message: 'Reset password email has been successfully sent.',
      status: 200,
      data: {},
    });
  } catch (error) {
    console.error('Error in requestResetEmailController:', error);
    res.status(error.status || 500).json({
      message: error.message,
      status: error.status || 500,
      data: {},
    });
  }
};

// export const resetPasswordController = async (req, res) => {
//   await authServices.resetPassword(req.body);
//   res.json({
//     status: 200,
//     message: 'Password was successfully reset!',
//     data: {},
//   });
// };
