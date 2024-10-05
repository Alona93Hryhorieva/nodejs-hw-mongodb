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

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.userId) {
    contactQuery.where('userId').equals(filter.userId);
  }
  // ПЕРЕМІСТИЛА МІСЦЯМИ
  const contacts = await contactQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });

  const count = await ContactCollection.find()
    .merge(contactQuery)
    .countDocuments();

  const paginationData = calculatePaginationData({ count, perPage, page });

  return {
    page,
    perPage,
    contacts,
    totalItems: count,
    ...paginationData,
  };
};

export const getContactById = (id) => ContactCollection.findById(id);

export const getContact = (filter) => ContactCollection.findOne(filter);

export const createContact = (payload) => ContactCollection.create(payload);

export const updateContact = async (filter, data, options = {}) => {
  const rawResult = await ContactCollection.findOneAndUpdate(filter, data, {
    new: true, // Додайте цю опцію для повернення оновленого документа
    ...options,
  });

  if (!rawResult) return null; // Якщо результату немає, повертаємо null

  // Повертаємо безпосередньо rawResult, якщо це звичайний об'єкт
  return rawResult; // Якщо rawResult є документом Mongoose, ви можете повернути його без змін
};
// export const updateContact = async (filter, update, options) => {
//   return await Contact.findOneAndUpdate(filter, update, {
//     ...options,
//     runValidators: true,
//   });
// };

export const deleteContact = (filter) =>
  ContactCollection.findOneAndDelete(filter);
