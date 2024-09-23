import ContactCollection from '../db/models/Contact.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  filter = {},
}) => {
  const skip = (page - 1) * perPage;
  const limit = perPage;

  let contactQuery = ContactCollection.find();

  // Застосування фільтрів
  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.userId) {
    contactQuery.where('userId').equals(filter.userId);
  }
  // Отримання контактів з пагінацією та сортуванням ПЕРЕМІСТИЛА МІСЦЯМИ
  const contacts = await contactQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  // Підрахунок загальної кількості документів з урахуванням фільтрів
  const count = await ContactCollection.find()
    .merge(contactQuery) // Застосовуємо фільтри
    .countDocuments(); // Підраховуємо загальну кількість документів

  // Розраховуємо дані для пагінації
  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    ...paginationData,
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
