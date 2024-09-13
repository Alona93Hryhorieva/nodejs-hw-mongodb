import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

const isValidId = (req, res, next) => {
  const { contactId } = req.params;

  if (!isValidObjectId(contactId)) {
    return next(createHttpError(400, `${contactId} not valid ID format`));
  }
  next();
};

export default isValidId;
