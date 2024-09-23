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
  // const { sortBy, sortOrder } = parseSortParams({ ...req.query, sortFields });

  const filter = parseContactFilterParams(req.query);

  const { _id: userId } = req.user;

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
    // data,
    data: {
      contacts: data.contacts, // перейменували на contacts
      userId, // Додаємо userId
      page: data.page, // поточна сторінка
      perPage: data.perPage, // кількість на сторінці
      totalItems: data.totalItems, // загальна кількість елементів
      totalPages: data.totalPages, // загальна кількість сторінок
      hasPreviousPage: data.hasPreviousPage, // інформація про попередню сторінку
      hasNextPage: data.hasNextPage, // інформація про наступну сторінку
    },
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
  const { _id: userId } = req.user;
  // console.log(req.user);
  const data = await contactServices.createContact({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const { _id: userId } = req.user;

  const { isNew, data } = await contactServices.updateContact(
    { _id: contactId, userId },
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
  const { _id: userId } = req.user;

  const result = await contactServices.updateContact(
    { _id: contactId, userId },
    req.body,
    { new: true },
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
  const { _id: userId } = req.user;

  const data = await contactServices.deleteContact({ _id: contactId, userId });

  if (!data) {
    throw createHttpError(404, `Contact ${contactId} not found`);
  }

  res.status(204).send();
};
