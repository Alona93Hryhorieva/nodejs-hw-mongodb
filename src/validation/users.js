import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const userRegisterSchema = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than or equal to 20 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().pattern(emailRegexp).min(3).required().messages({
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(3).required().messages({
    'string.password': 'Password must be a valid',
  }),
});
/*JOI немає доступу до бази */
export const userLoginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(3).required().messages({
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().min(3).required().messages({
    'string.password': 'Password must be a valid',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().pattern(emailRegexp),
});

export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().required(),
});

export const loginWithGoogleOAuthSchema = Joi.object({
  code: Joi.string().required(),
});
