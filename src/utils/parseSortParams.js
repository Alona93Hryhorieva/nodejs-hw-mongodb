import { SORT_ORDER } from '../constants/index.js';

const parseSortParams = ({ sortBy, sortFields, sortOrder }) => {
  // console.log('Received parameters:');
  // console.log('sortBy:', sortBy);
  // console.log('sortFields:', sortFields);
  // console.log('sortOrder:', sortOrder);

  if (!Array.isArray(sortFields)) {
    throw new Error('sortFields must be an array');
  }

  if (!Array.isArray(SORT_ORDER)) {
    throw new Error('SORT_ORDER must be an array');
  }

  // console.log('SORT_ORDER:', SORT_ORDER);

  const parsedSortBy = sortFields.includes(sortBy) ? sortBy : '_id';
  // console.log('Parsed sortBy:', parsedSortBy);

  const parsedSortOrder = SORT_ORDER.includes(sortOrder)
    ? sortOrder
    : SORT_ORDER[0];
  // console.log('Parsed sortOrder:', parsedSortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};

export default parseSortParams;
