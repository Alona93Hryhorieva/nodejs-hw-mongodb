const calculatePaginationData = ({ count, perPage, page }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page !== 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
    /*додаткові параметри ВІД СЕБЕ*/
    page,
    perPage,
    totalItems: count,
  };
};

export default calculatePaginationData;
