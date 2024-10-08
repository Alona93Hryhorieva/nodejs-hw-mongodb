import Joi from 'joi';
import { contactTypeList } from '../constants/constant.js';

export const contactAddSchema = Joi.object({
  name: Joi.string().min(4).max(20).required().messages({
    'string.base': 'Name must be a string',
    'string.empty': 'Name cannot be empty',
    'string.min': 'Name must be at least 3 characters long',
    'string.max': 'Name must be less than or equal to 20 characters long',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Phone number must be a string',
    'string.empty': 'Phone number cannot be empty',
    'string.min': 'Phone number must be at least 3 characters long',
    'string.max':
      'Phone number must be less than or equal to 20 characters long',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.email': 'Email must be a valid email address',
  }),
  isFavorite: Joi.boolean().messages({
    'boolean.base': 'IsFavourite must be a boolean',
  }),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid(...contactTypeList)
    .required()
    .messages({
      'string.base': 'Contact type must be a string',
      'any.only': 'Contact type must be one of the allowed values',
      'any.required': 'Contact type is required',
    }),
});

export const contactPatchSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'any.required': 'Name is required',
    'string.min': 'Name must be at least 3 characters',
    'string.max': 'Name must be less than 20 characters',
  }),
  phoneNumber: Joi.string().required().messages({
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().email().min(3).max(20),
  isFavorite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.required': 'Contact type is required',
    }),
});
