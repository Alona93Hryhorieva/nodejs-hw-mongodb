// import parseInteger from './parseNumber.js';

const parseContactFilterParams = ({ type, isFavourite }) => {
  const filter = {};

  // Додаємо до об'єкта фільтрації значення type, якщо воно є
  if (type) {
    filter.contactType = type;
  }

  // Додаємо до об'єкта фільтрації значення isFavourite, якщо воно є
  if (isFavourite !== undefined) {
    filter.isFavourite = isFavourite === 'true'; // Перетворюємо значення на булеве
  }

  return filter;
};

export default parseContactFilterParams;
