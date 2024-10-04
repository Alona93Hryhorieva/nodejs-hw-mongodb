import createHttpError from 'http-errors';

export const validateBody = (schema) => {
  const func = async (req, res, next) => {
    // console.log('Request Body before validation:', req.body); // Логування перед валідацією

    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      const validateError = createHttpError(400, error.message);
      next(validateError);
    }
  };

  return func;
};

export default validateBody;
