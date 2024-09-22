import { Router } from 'express';
/*
import {getContactById,getAllContacts} from './services/contacts.js'
const contactServices = {
 getAllContacts,
 getContactById,
}
*/
import * as contactControllers from '../controllers/contacts.js'; /* короткий запис*/
// import {
//   getAllContactsController,
//   getContactByIdController,
//   addContactController,
// } from '../controllers/contacts.js';
import authenticate from '../middlewares/authenticate.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import validateBody from '../utils/validateBody.js';
import {
  contactAddSchema,
  contactPatchSchema,
} from '../validation/contacts.js';

import isValidId from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/',
  ctrlWrapper(contactControllers.getAllContactsController),
);

contactsRouter.get(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.getContactByIdController),
);

contactsRouter.post(
  '/',
  // async (req, res, next) => {
  //   try {
  //     await contactAddSchema.validateAsync(req.body);
  //     next();
  //   } catch (error) {
  //     const ValidateError = createHttpError(400, error.message);
  //     next(ValidateError);
  //   }
  // },ЗАСТОСОВУЄТЬСЯ ОБГОРТКА ДЛЯ ПЕРЕВІРКИ
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.addContactController),
);

contactsRouter.put(
  '/:contactId',
  isValidId,
  validateBody(contactAddSchema),
  ctrlWrapper(contactControllers.upsertContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId,
  validateBody(contactPatchSchema),
  ctrlWrapper(contactControllers.patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId,
  ctrlWrapper(contactControllers.deleteContactController),
);

export default contactsRouter;
