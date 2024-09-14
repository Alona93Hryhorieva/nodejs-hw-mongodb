const parseInteger = (value, defaultValue) => {
  // console.log(value);
  if (typeof perPage !== 'string') return defaultValue;

  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue;

  return parsedValue;
};

const parsePaginationParams = ({ perPage, page }) => {
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

  return {
    perPage: parsedPerPage,
    page: parsedPage,
  };
};

export default parsePaginationParams;
