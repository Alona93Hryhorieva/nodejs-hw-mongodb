import ContactCollection from '../db/models/Contact.js';
import parseContactFilterParams from '../utils/filters/parseContactFilterParams.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
  userId, // Додаємо userId до параметрів
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  let contactQuery = ContactCollection.find();

  // Застосування фільтрів
  if (filter.contactType) {
    contactQuery = contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.userId) {
    contactQuery = contactQuery.where('userId').equals(filter.userId);
  }
  // Підрахунок загальної кількості документів з урахуванням фільтрів, але без пагінації
  const count = await ContactCollection.find()
    .merge(contactQuery) // Застосовуємо фільтри
    .countDocuments(); // Підраховуємо загальну кількість документів

  // Отримання контактів з пагінацією та сортуванням
  const contacts = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // Розраховуємо дані для пагінації
  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts, // Важливо: повертаємо контакти
    ...paginationData, // Додаємо totalItems, totalPages, hasNextPage, hasPreviousPage
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    includeResultMetadata: true,
    ...options,
  });

  if (!rawResult || !rawResult.value) return null;

  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject?.upserted),
  };
};

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
