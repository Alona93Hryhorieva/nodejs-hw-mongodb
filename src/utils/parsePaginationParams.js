const parseInteger = (value, defaultValue) => {
  // Логування для діагностики
  // console.log('Parsing value:', value);

  // Перевірка на тип value
  if (typeof value !== 'string') return defaultValue;

  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

const parsePaginationParams = ({ perPage, page }) => {
  // console.log('Raw query params:', { perPage, page }); // Логування вхідних значень
  //   let  = null;
  //   if (typeof perPage !== 'string') {
  //     parsedPerPage = 10;
  //   }
  //   if (Number.isNaN(parseInt(perPage))) {
  //     parsedPerPage = 10;
  //   } else {
  //     parsedPerPage = parseInt(perPage);
  //   }
  const parsedPerPage = parseInteger(perPage, 10);
  const parsedPage = parseInteger(page, 1);

  // console.log('Parsed params:', { perPage: parsedPerPage, page: parsedPage }); // Логування результату

  return {
    perPage: parsedPerPage,
    page: parsedPage,
  };
};

export default parsePaginationParams;
