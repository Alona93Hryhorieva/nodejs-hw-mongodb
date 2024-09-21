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
