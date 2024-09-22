import Joi from 'joi';

import { emailRegexp } from '../constants/users.js';

export const userSignupSchema = Joi.object({
  username: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than or equal to 20 characters long',
    'any.required': 'Name is required',
  }),
  email: Joi.string().pattern(emailRegexp).min(3).max(20).required().messages({
    'string.email': 'Please enter a valid email address',
  }),
  password: Joi.string().min(3).max(20).required().messages({
    'string.password': 'Password must be a valid',
  }),
});
/*JOI немає доступу до бази */
export const userSigninSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).min(3).max(20).required().messages({
    'string.email': 'Email must be a valid email address',
  }),
  password: Joi.string().min(3).max(20).required().messages({
    'string.password': 'Password must be a valid',
  }),
});

// const Joi = require('joi'); жпт

// const loginSchema = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().min(6).required(),
// });

// module.exports = { loginSchema };
