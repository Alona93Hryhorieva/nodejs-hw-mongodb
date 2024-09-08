import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
/*
import {getContactById,getAllContacts} from './services/contacts.js'
const contactServices = {
 getAllContacts,
 getContactById,
}
*/

//ДО ЗАСТОСУВАННЯ CTRL ПРИБИРАЄМО TRYCATH, NEXT (next Я ЙОГО ВИДАЛЯЮ ПОВНІСТЮ , АЛЕ ВІН БУВ В КОДІ ДО ЦЬОГО в аргументі )
export const getAllContactsController = async (req, res) => {
  //   try {
  const data = await contactServices.getAllContacts();

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
  //   } catch (error) {
  //      res.status(500).json({
  //        message: error.message, ДО ЗАСТОСУВАННЯ ФУНКЦІЇ NEXT
  //     });
  //     next(error);
  //   }
};

//ДО ЗАСТОСУВАННЯ CTRL ПРИБИРАЄМО TRYCATH, NEXT (next Я ЙОГО ВИДАЛЯЮ ПОВНІСТЮ , АЛЕ ВІН БУВ В КОДІ ДО ЦЬОГО в аргументі )
export const getContactByIdController = async (req, res) => {
  //   try {
  const { contactId } = req.params;
  const data = await contactServices.getContactById(contactId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
    //   const error = new Error('Contact with id=${contactId} not found');ДО ЗАСТОСУВАННЯ createHttpError
    //   error.status = 404;
    //   throw error;
    //   return res.status(404).json({
    //     message: `Contact with id=${contactId} not found`,СКОРОЧЕННЯ ЗАПИСУ
    //   });
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data,
  });
  //   } catch (error) {
  //     const { status = 500, message } = error;  ДО ЗАСТОСУВАННЯ ФУНКЦІЇ NEXT
  //      res.status(500).json({
  //        message,
  //     });
  //     next(error);
  //   }
};

export const addContactController = async (req, res) => {
  const data = await contactServices.createContact(req.body);
  res.json({
    status: 201,
    message: `Successfully created a contact!`,
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId },
    req.body,
    { upsert: true },
  );
  // console.log(isNew);
  // console.log(data);

  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Contact upsert successfully',
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const result = await contactServices.updateContact(
    { _id: contactId },
    req.body,
  );

  if (!result) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }

  res.json({
    status: 200,
    message: 'Contact patched successfully',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const data = await contactServices.deleteContact({ _id: contactId });

  if (!data) {
    throw createHttpError(404, `Movie with id=${contactId} not found`);
  }

  res.status(204).send();
};
