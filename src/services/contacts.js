import ContactCollection from '../db/models/Contact.js';

import calculatePaginationData from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';

export const getAllContacts = async ({
  perPage,
  page,
  sortBy = '_id',
  sortOrder = SORT_ORDER[0],
  // filter = {},ФІЛЬТРАЦІЯ ПО РОКУ
}) => {
  const skip = (page - 1) * perPage;

  const contactQuery =
    ContactCollection.find(); /*ЗАПИТ ДО БАЗИ  ЩОБ ОТРИМАТИ РЕЗУЛЬТАТ resuelt = await  contactQuery;    */
  // console.log(contactQuery);

  // if (filter.minReleaseYear)  -поле і  умови фільтрації  ФІЛЬТРАЦІЯ ПО РОКУ{
  //   ContactCollection.find()where("releaseYear").gte(filter. minReleaseYear)
  // } if (filter.maxReleaseYear) {
  //   contactQuery.where("releaseYear").lte(filter.maxReleaseYear)
  // }

  const contacts = await contactQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  const count = await ContactCollection.find()
    .merge(contactQuery)
    .countDocuments();
  //  console.log(filter);ФІЛЬТРАЦІЯ ПО РОКУ

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    totalItems: count,
    // totalPages,
    // hasNextPage,
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
