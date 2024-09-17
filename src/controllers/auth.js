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
  const signinCreads = await authServices.signin(req.body);

  res.status(201).json({
    status: 201,
    message: 'Succsessfully register user',
    data: newUser,
  });
};
