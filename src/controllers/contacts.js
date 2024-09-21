import createHttpError from 'http-errors';
import * as contactServices from '../services/contacts.js';
import parsePaginationParams from '../utils/parsePaginationParams.js';
import parseSortParams from '../utils/parseSortParams.js';
import { sortFields } from '../db/models/Contact.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';

export const getAllContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);
  // console.log('Parsed perPage:', perPage); // Це має вивести значення perPage
  // console.log('Parsed page:', page); // Це має вивести значення page
  // console.log(req.query);ЕТАП СОРТУВАННЯ
  const { sortBy, sortOrder } = parseSortParams({
    sortBy: req.query.sortBy,
    sortFields,
    sortOrder: req.query.sortOrder,
  });

  const filter = parseContactFilterParams(req.query);

  const data = await contactServices.getAllContacts({
    perPage,
    page,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data: {
      data: data.contacts,
      page: data.page, //поточна сторінка
      perPage: data.perPage, //кількість на сторінці
      totalItems: data.totalItems, // Додаємо загальну кількість елементів
      totalPages: data.totalPages, // Додаємо загальну кількість сторінок
      hasPreviousPage: data.hasPreviousPage, // Додаємо інформацію про попередню сторінку
      hasNextPage: data.hasNextPage, // Додаємо інформацію про наступну сторінку
    },
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
  const data = await contactServices.createContact(req.body);

  res.status(201).json({
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
