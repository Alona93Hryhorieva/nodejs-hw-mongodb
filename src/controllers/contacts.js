import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import { contactAddSchema } from '../validation/contacts.js';

export const getAllContactsController = async (req, res) => {
  const data = await contactServices.getAllContacts();
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const data = await contactServices.getContactById(contactId);

  if (!data) {
    throw createHttpError(404, `Contact with id=${contactId} not found`);
  }
  res.json({
    status: 200,
    message: `Contact with ${contactId} successfully find`,
    data,
  });
};

export const addContactController = async (req, res) => {
  try {
    await contactAddSchema.validateAsync(req.body, {
      abortEarly: false,
    });
    console.log('Validation success');
  } catch (error) {
    console.log(error.message);
  }
  // const data = await contactServices.createContact(req.body);
  //  Встановлюємо статус 201 перед відправкою відповіді
  // res.status(201).json({
  //   status: 201,
  //   message: `Successfully created a contact!`,
  //   data,
  // });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId },
    req.body,
    { upsert: true },
  );
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
    throw createHttpError(404, `Contact ${contactId} not found`);
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
    throw createHttpError(404, `Contact ${contactId} not found`);
  }

  res.status(204).send();
};
