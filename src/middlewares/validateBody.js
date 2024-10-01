import { body, validationResult } from 'express-validator';

export const validateBody = [
  // Валідація email
  body('email').isEmail().withMessage('Invalid email format'),

  // Функція для перевірки валідації
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// export const validateBody = (schema) => async (req, res, next) => {
//   try {
//     await schema.validateAsync(req.body, {
//       abortEarly: false,
//     });
//     next();
//   } catch (err) {
//     const error = createHttpError(400, 'Bad request', {
//       errors: err.details,
//     });
//     next(error);
//   }
// };
