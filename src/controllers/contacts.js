import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

const enableCloudinary = env('ENABLE_CLOUDINARY');

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });

  const filter = parseContactFilterParams(req.query);

  const { _id: userId } = req.user;
  // const { role: role } = req.user;
  //  if (role === ROLES.ADMIN) {
  //    userId = null;
  //  }

  const data = await contactServices.getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter: { ...filter, userId },
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;
  const data = await contactServices.getContact({ _id: contactId, userId });

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
  console.log(req.body);
  console.log(req.file);

  //  let photo;
  //  if (req.file) {
  //    if (enableCloudinary === 'true') {
  //      photo = await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb');
  //    } else {
  //      photo = await saveFileToUploadDir(req.file);
  //    }
  //  }

  // const { _id: userId } = req.user;
  // const data = await contactServices.createContact({ ...req.body, userId,photo  });

  // res.status(201).json({
  //   status: 201,
  //   message: `Successfully created a contact!`,
  //   data,
  // });
};

export const upsertContactController = async (req, res) => {
  let photo;
  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb');
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId, userId },
    { ...req.body, photo },
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
  const { _id: userId } = req.user;

  const updatedData = {
    ...req.body,
    ...(req.file && { photo: req.file.path }), // Додаємо шлях до завантаженого фото, якщо воно є
  };

  // const result = await contactServices.updateContact(
  //   { _id: contactId, userId },
  //   req.body,
  //   { new: true },
  // ); викладач
  const result = await contactServices.updateContact(
    { _id: contactId, userId }, // Умови пошуку (ID контакту та користувача)
    updatedData, // Дані для оновлення
    { new: true }, // Повернути оновлений документ
  );

  if (!result) {
    throw createHttpError(404, `Contact ${contactId} not found`);
  }

  res.json({
    status: 200,
    message: 'Contact patched successfully',
    // data: result.data,ЦЕ ПЕРШЕ БУЛО
    data: result, // Повертаємо сам оновлений документ
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const data = await contactServices.deleteContact({ _id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact ${contactId} not found`);
  }

  res.status(204).send();
};
