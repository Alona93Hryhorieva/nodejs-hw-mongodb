const calculatePaginationData = ({ count, perPage, page }) => {
  const totalPages = Math.ceil(count / perPage);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page !== 1;

  return {
    totalPages,
    hasNextPage,
    hasPreviousPage,
    page,
    perPage,
    totalItems: count,
  };
};

export default calculatePaginationData;
