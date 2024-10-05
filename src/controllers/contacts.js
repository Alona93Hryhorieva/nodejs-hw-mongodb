import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';
import saveFileToUploadDir from '../utils/saveFileToUploadDir.js';
import saveFileToCloudinary from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';
import mongoose from 'mongoose';

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
  // console.log(req.body);
  // console.log(req.file);
  let photo;
  if (req.file) {
    if (enableCloudinary === 'true') {
      photo = await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb');
    } else {
      photo = await saveFileToUploadDir(req.file);
    }
  }

  const { _id: userId } = req.user;
  const data = await contactServices.createContact({
    ...req.body,
    userId,
    photo,
  });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data,
  });
};
// export const upsertContactController = async (req, res) => {
//   let photo;
//   if (req.file) {
//     photo =
//       enableCloudinary === 'true'
//         ? await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb')
//         : await saveFileToUploadDir(req.file);
//   }

//   const { contactId } = req.params;
//   const { _id: userId } = req.user;

//   // Оновлюємо тільки ті поля, що були передані
//   const updatedData = {
//     ...req.body,
//     ...(photo && { photo }), // Якщо фото було завантажене, додаємо його до оновлень
//   };

//   const { isNew, data } = await contactServices.updateContact(
//     { _id: contactId, userId },
//     updatedData,
//     { upsert: true },
//   );

//   const status = isNew ? 201 : 200;

//   res.status(status).json({
//     status,
//     message: 'Contact upserted successfully',
//     data,
//   });
// };
export const upsertContactController = async (req, res) => {
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

// export const patchContactController = async (req, res) => {
//   let photo;
//   if (req.file) {
//     if (enableCloudinary === 'true') {
//       photo = await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb');
//     } else {
//       photo = await saveFileToUploadDir(req.file);
//     }
//   }

//   const { contactId } = req.params;
//   const { _id: userId } = req.user;

//   // Формуємо нові дані для оновлення контакту
//   const updatedData = {
//     ...req.body,
//     ...(photo && { photo }), // Додаємо URL або шлях до фото, якщо є
//   };

//   // Оновлюємо контакт
//   const result = await contactServices.updateContact(
//     { _id: contactId, userId },
//     updatedData, // Використовуємо нові дані
//     { new: true },
//   );

//   if (!result) {
//     throw createHttpError(404, `Contact ${contactId} not found`);
//   }

//   // Формуємо відповідь, видаляючи зайві поля
//   const { __v, isNew, ...data } = result.toObject(); // Перетворюємо на об'єкт і видаляємо поля

//   res.json({
//     status: 200,
//     message: 'Contact patched successfully',
//     data, // Повертаємо очищені дані
//   });
// };
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;

  // Перевіряємо, чи є contactId дійсним ObjectId
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({
      message: `${contactId} not valid ID format`,
    });
  }

  let photo;
  if (req.file) {
    try {
      if (enableCloudinary === 'true') {
        photo = await saveFileToCloudinary(req.file, 'nodejs-hw-mongodb');
      } else {
        photo = await saveFileToUploadDir(req.file);
      }
    } catch (error) {
      return next(createHttpError(500, 'Error saving file'));
    }
  }

  const { _id: userId } = req.user;

  // Формуємо нові дані для оновлення контакту
  const updatedData = {
    ...req.body,
    ...(photo && { photo }),
  };

  // Оновлюємо контакт
  const result = await contactServices.updateContact(
    { _id: contactId, userId },
    updatedData,
    { new: true },
  );

  if (!result) {
    return next(createHttpError(404, `Contact ${contactId} not found`));
  }

  // Повертаємо очищені дані без toObject()
  const data = result.toObject ? result.toObject() : result; // Перевірка, чи result є документом

  // Якщо data має поля, які не потрібно повертати
  const { __v, isNew, ...cleanData } = data;

  res.json({
    status: 200,
    message: 'Contact patched successfully',
    data: cleanData,
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
